---
title: 1부 - 코틀린 코루틴 이해하기 (Coroutine DEEP DIVE)
date: '2026-02-01 00:10:00'
author: Winter
tags:
- Coroutine
categories: Coroutine
private: false
thumbnail: 'cover.png'
---

본문에서 자주 사용하는 단축어 정의: 
> cont: Continuation 객체의 줄임말. 
> 코드에서는 `cont` 또는 `continuation`으로 표기될 수 있음.

---

# 코틀린 코루틴을 배워야 하는 이유

안드로이드에선 UI를 다루는 스레드가 하나만 존재한다.
RestAPI 를 호출해서 데이터를 불러오고, 이를 UI 에 보여주기까지의 과정을 생각해보자.

**스레드 전환:**
스레드에서 RestAPI 호출 후, `runOnUiThread { ... }` 를 통해 UI 스레드로 전환하는 방법이 있다. 
하지만 스레드가 실행 되었을때 멈출수 있는 방법이 없어 메모리 누수로 이어질 수 있다.
스레드를 많이 생성하면 비용이 많이 들기도 하고, 코드가 길어지고 이해하기 어려워지는 문제도 있다.

**콜백:**
대안으로 콜백 활용을 생각해볼 수 있다. 
취소할 수는 있지만 매우 번거로워서 쉽지 않은 일이다.
그리고 여러번 중첩되어 사용되는 패턴인 "콜백 지옥"이 형성되어 읽기 어려운 코드가 될 수 있다.

**RxJava & 리액티브 스트림:**
오랫동안 자바 진영에서 인기있는 해결책은 RxJava, 리액티브 스트림이 있다.
이 방법은 스트림 내에서 일어나는 모든 연산을 시작, 처리 관찰할 수 있다.
스레드 전환과 동시성 처리를 지원하기 때문에 애플리케이션 내의 연산을 병렬 처리할 수 있다.
취소가 가능, 메모리 누수가 없어서 스레드를 적절하게 사용할 수 있다.
단점이 있다면 구현하기 아주 복잡하다는 것이다.

**코틀린 코루틴 사용:**
핵심은 코루틴을 특정 지점에서 멈추고, 이후에 재개할 수 있다는 것.
코루틴을 사용하면 UI 스레드 블로킹 없이 중단 지점을 만들고 API 에서 데이터를 불러올 수 있다.
API 를 불러온 뒤, 중단한 지점에서 다시 시작하여 UI 를 업데이트 할 수 있다.

코루틴 중단 함수 안에선 비동기 코드를 마치 동기 코드처럼 순차적으로 작성할 수 있다.
또는 비동기 코드를 병렬로 실행하여 (`async { }`, `await()`) 호출 결과를 더 빨리 받아볼 수 있다.
이 모든것을 읽기 쉬운 간단한 코드로 구현할 수 있다. 

```kotlin
fun showNews() {
  viewModelScope.launch {
    val config = async { getConfigFromApi() }
    val news = async { gerNewsFromApi() }
    val user = async { gerUserFromApi() }
    view.showNews(user.await(). news.await())
  }
}
```

코루틴을 사용하면를 스레드를 재우는 대신 "코루틴"을 중단 시킨다.
코루틴을 시작하는 비용은 스레드와 비교되지 않을만큼 저렴하다.

## 요약 
코루틴은 스레드를 블로킹 하지 않고 중단 지점을 만들어서 비동기 로직을 실행한 뒤, 중단 지점에서 로직을 재개할 수 있다.
이 동작은 어떤 비동기 로직 실행 방법보다 읽기 쉽게 작성할 수 있다.
중단 함수는 취소가 가능하며, 스레드보다 비용이 적게 든다.
 
추가 장점: 멀티플랫폼에서도 사용할 수 있다.

# 시퀀스 빌더

코틀린에서는 제너레이터 대신 시퀀스를 생성할 때 사용하는 시퀀스 빌더를 제공한다.
시퀀스 빌더는 필요할 때마다 값을 하나씩 계산하는 지연 처리를 한다.
때문에 요구되는 연산을 최소한으로 수행해서 메모리 사용이 효율적이다.

```kotlin
val seq = sequence {
  yeild(1)
  yeild(2)
  yeild(3)
}
fun main() {
  for (num in seq) {
      print(num)
  } // 123
}
```

여기서 알아야 할것은 각 숫자가 미리 생성되는 대신, 필요할 때마다 생성된다는 점이다.

```kotlin
val seq = requence {
  println("Generating first")
  yeild(1)
  println("Generating second")
  yeild(2)
  println("Generating third")
  yeild(3)
  println("Done")
}
fun main() {
  for (num in seq) {
      println("The next number is $num")
  }
}
// Generating first
// The next number is 1
// Generating second
// The next number is 2
// Generating third
// The next number is 3
// Done
```

시퀀스의 작동 방식에 대해 알아보자. 
"Generating first" 를 출력한 뒤 -> 숫자 1을 반환한다.
이후 반복문에서 반환된 값을 반은 뒤 -> "Next number is 1"을 출력한다.
여기서 반복문과 다른 점을 알아야 한다.

main: `val num = seq.next()`

seq: `println("Generating first")`

seq: `yeild(1)` <- 1 반환

main `println("The next number is $num")` <- 중단 후 시퀀스에서 반환한 값 1 출력

main: `val num = seq.next()` <- 중단 지점에서 시퀀스 다시 재개

seq: `println("Generating second")` <- 중단 지점으로부터 다음 메시지 출력

seq: `yeild(2)` <- 2 반환

main `println("The next number is $num")` <- 다시 중단 후 시퀀스에서 반환한 값 2 출력

...

**중단이 왜 필요한가?**
위 예시 패턴처럼, 중단이 가능하기 때문에 main 함수와 시퀀스 제너레이터가 번갈아가면서 실행될 수 있기 때문이라고 한다.

시퀀스 빌더는 반환(yield)이 아닌 중단 함수를 사용하면 안 된다. 
중단이 필요하다면 데이터를 가져오기 위해 나중에 배울 플로우를 사용하는 것이 낫다.
플로우 빌더가 작동하는 방식은 시퀀스 빌더와 비슷하지만, 플로우는 여러가지 코루틴 기능을 지원한다고 한다. 

다음 장에서 중단이 어떻게 작동하는지 살펴보자.

# 중단은 어떻게 작동할까?

중단 함수는 코틀린 코투린의 핵심이다. 
코투린을 중단한다는 건 실행을 중간에 멈추는것을 의미한다. 
비디오 게임을 하다 멈추는 상황과 비슷하다.

코루틴은 중단 되었을 때 cont 객체를 반환한다.
이 객체는 게임을 저장하는 것과 비슷하다.
cont 를 이용하면 멈췄던 곳에서 다시 코루틴을 실행할 수 있다.
다른 스레드에서 시작할 수 있다.
중단했을 때 코루틴은 어떤 자원도 사용하지 않는다.

## 재개

코루틴은 `runBlocking` 이나 `launch` 와 같은 코루틴 빌더를 통해 만들 수 있다. </br>
중단 함수 코루틴을 중단할 수 있는 함수다. </br>
중단 함수는 반드시 코루틴 혹은 다른 중단 함수에 의해 호출 되어야 한다. </br>
중단 함수는 중단할 수 있는곳이 필요하다. </br>

```kotlin
suspend fun main() {
  println("Before")
  suspendCoroutine<Unit> { }
  println("After")
}
// Before
```

Before 와 After 사이에 중단을 하는 예시다. 
위 결과처럼 After 는 출력되지 않으며 코드는 실행된 상태로 유지된다.
main 함수가 끝나지 않았기 때문.
프로그램은 멈춘채 재개되지 않는다.

```kotlin
suspend fun main() {
  println("Before")
  suspendCoroutine<Unit> { cont ->
    cont.resume()
  }
  println("After")
}
// Before
// After
```

cont 객체를 사용해서 코루틴을 중단한 후 곧바로 실행할 수 있다.
cont 에서 resume 을 호출했기 때문에 After 를 호출할 수 있게 되었다.

> 코틀린 1.3 이후부턴 `resumeWith()` 함수만 사용할 수 있다고 한다.

suspendScope 에서 잠깐 동안 정지(sleep)된 뒤 재개되는 다른 스레드를 실행할수도 있다.

```kotlin
suspend fun main() {
  println("Before")
  suspendCoroutine<Unit> { continuation ->
      thread {
          println("Suspended")
          Thread.sleep(1000)
          continuation.resume(Unit)
          println("Resume")
      }
  }
  println("After")
}
// Before
// Suspended
// (1초 후)
// After
// Resumed
```

위 예제로부터 다른 스레드가 재개하는 방식은 코투린을 이해하는데 중요하다.

## 값으로 재개하기

suspend 함수에 기본적으로 Unit 을 인자로 넘길수 있고, 객체로 반환될 값의 타입을 지정할수도 있다

```kotlin
// Unit 을 인자로 넘기는 경우
val ret: Unit = 
  suspendCoroutine<Unit> { cont: Continuation<Unit> ->
    cont.resume(Unit)
  }
```

```kotlin
// 특정 타입을 인자로 넘기는 경우
suspend fun main() {
  val ret: Unit = 
      
  val i: Int = suspendCoroutine<Int> { cont ->
    cont.resume(42)
  }
  println(i) // 42
  
  val str: String = suspendCoroutine<String> { cont ->
    cont.resume("Some text")
  }
  println(str) // Some tex

  val b: Boolean = suspendCoroutine<Boolean> { cont ->
      cont.resume(true)
  }
  println(b) // true
}
```

RestAPI 호출에서 응용하는 방법.

```kotlin
suspend fun main() {
  println("Before")
  val user = suspendCoroutine<User> {
    requestUser { user ->
      cont.resume(user)
    }    
  }
  println(user)
  println("After")
}
// Before
// (1초 후)
// User(name=Test)
// After
```

## 예외로 재개하기

우리가 사용하는 모든 함수는 값을 반환하거나 예외를 던진다. suspendCoroutine 또한 마찬가지.

보통 네트워크 관련 예외를 알릴 때 사용할 수 있다.

`resume()` 호출:  인자로 들어온 데이터를 반환한다. </br>
`resumeWithException()` 호출: 중단된 지점에서 인자로 넣어준 예외를 던진다.

```kotlin
class MyException : Throwable("Just an exception")

suspend fun main() {
  try {
    suspendCoroutine<Unit> { cont ->
      cont.resumeWithException(MyException())
    }
  } catch (e: MyExeption) {
    println("Caught!")
  }
}
// Caught!
```

## 함수가 아닌 코루틴을 중단시킨다

함수가 아닌 코루틴을 중단하는 것.
중단 함수는 코루틴이 아니다.
중단 함수는 코루틴을 중단할 수 있는 함수라고 한다.

아래 예시를 보자. 이 이예시는 의도와 달리 종료되지 않는다.

```kotlin
var continuatino: Continuation<Unit>? = null

suspend fun suspendAndSetContinuation() {
  suspendCoroutine<Unit> { cont ->
    continuation = cont
  }
}

suspend fun main() {
  println("Before")
    
  suspendAndSetContinuation()
  continuation?.resume(Unit)
    
  println(After)
}
// Before
```

여기서 resume() 은 호출되지 않는다.
다른 스레드나 다른 코루틴으로 재개하지 않으면 프로그램은 실행된 상태로 유지된다.

이 섹션의 첫 내용을 다시 상기하며 개념 정리: </br>
**코루틴, 코루틴 스코프:** 둘 다 코루틴을 지칭한다. </br>
**중단 함수:** 코루틴을 중단할 수 있는 함수다.

> 중단 함수는 코루틴을 실행 시킬수 있는 함수.

> 코루틴은 일시 중단과 재개를 시킬 수 있다. 

# 코루틴의 실제 구현

- 중단 함수가 상태를 가지는 시점: 함수가 시작할때와 중단 함수가 호출 되었을때.
  이렇듯, 중단 함수가 상태를 가진다는 점에서 상태 머신 (state machine) 과 비슷하다.


- cont 객체는 상태를 나타내는 숫자와 로컬 데이터를 가지고 있다.


- 호출된 함수의 cont 는 호출한 함수의 cont 를 감싸면서 체인을 형성한다. 
  이 체인이 코루틴의 콜 스택 역할을 한다 — 함수가 끝나면 이 체인을 따라 되돌아간다.
  ```kotlin
  호출 순서: a() -> b() -> c()
  
  // Continuation 체인
  c.cont -> b.cont -> a.cont // 각각 이전 호출자를 참조
  
  // 반환 순서
  c 완료 → b resume → b 완료 → a resume → a 완료
  ```

## 컨티뉴에이션 전달 방식

중단 함수는 여러 방식으로 구현할 수 있다.
코틀린 팀은 **컨티뉴에이션 전달 방식**(continuation-passing style)을 택했다고 한다.

컨티뉴에이션은 함수에서 함수로 파라미터를 통해 전달된다.
관례상 컨티뉴에이션은 마지막 파라미터로 정렬 한다고 한다.

```kotlin
suspend fun getUser(): User?
suspend fun setUser(user: User)
suspend fun checkAvailability(flight: Flight): Boolean

fun getUser(continuation: Continuatoin<*>): Any?
fun setUser(
  user: User, 
  continuation: Continuation<*>,
): Any
fun checkAvailability(
  flight: Flight,
  continuation: Continuation<*>,
): Any
```

중단 함수 내부를 들여다보면 원래 선언했던 형태와 반환 타입이 Any 또는 Any? 로 바뀌었다.
그 이유는, 중단 함수를 실행하는 도중에 중단되면 선언된 타입의 값을 반환하지 않을수 있기 때문이라고 한다.
이때 중단 함수는 `COROUTINE_SUSPENDED`라는 특별한 마커를 반환한다.

지금은 `getUser()` 함수가 `User?` or `COROUTINE_SUSPENDED` 를 반환할 수 있기 때문에,
이 결과와 가장 가까운 슈퍼 타입인 `Any?` 로 지정된 것이다.

## 아주 간단한 함수

```kotlin
suspend fun myFunction() {
    println("Before")
    delay(1000) // 중단 함수
    println("After")    
}
```

`myFunction` 함수의 시그니처(signature)를 다음과 같이 추론할 수 있다.

```kotlin
fun myFunction(continuation: Continuation<*>): Any
```

이번에 알아볼 것은, 이 함수는 상태를 저장하기 위해 자신만의 cont 객체가 필요할것이다.
이 상태명을 `MyFunctionContinuation` 이라고 가정해보자.

```
val continuation = MyFunctionContinuation(continuation)
```

`myFunction` 함수가 실행될 때 파라미터인 continuation 을 자신만의 컨티뉴에이션인 `MyFunctionContinuation` 으로 포장한다.

이미 래핑된 컨티뉴에이션이면 그대로 두고, 아니면 새로 래핑한다.
만약 코루틴이 재실행되고 있으면 컨티뉴에이션 객체는 이미 래핑되어 있을것이므로 컨티뉴에이션 객체를 그대로 둬야한다.

```kotlin
val continuation = 
    continuation as? MyFunctionContinuation 
    ?: MyFunctionContinuation(continuation)
```

`myFunction` 함수가 시작되는 지점은 함수의 시작점과 중단 이후 재개 시점 두 곳이다. 
현재 상태를 저장하려면 `label` 이라는 필드를 사용한다.
함수가 처음 시작할 때 이 `label` 값은 0으로 설정된다.
이후 중단되기 전에 다음 상태로 설정되어 코루틴이 재개될 시점을 알 수 있게 도와준다.

```kotlin
// myFunction 의 세부 구현을 간단하게 표현한 예시
fun myFunction(continuation: Continuation<Unit>): Any {
  val continuation = continuation as? MyFunctionContinuation
      ?: MyFunctionContinuation(continuation)
      
  if (continuation.label == 0) {
      println("Before")
      continuation.label = 1
      if (delay(1000, continuation) == COROUTINE_SUSPEND) {
          return COROUTINE_SUSPEND
      }
  }
  if (continuation.label == 1) {
      println("After")
      return Unit
  }
  error("Impossible")
}
```

위 코드에 중요한 부분이 있다.
`delay` 에 의해 중단된 경우, `delay` 로부터 `COROUTINE_SUSPEND` 가 반환된다.
`myFunction` 은 `COROUTINE_SUSPEND`를 반환한다.
`myFunction`을 호출한 함수부터 시작해 콜 스택에 있는 모든 함수도 똑같다.

즉, 중단이 일어나면 콜 스택에 있는 모든 함수가 `COROUTINE_SUSPEND` 를 반환 받으며,
결과적으로 아래와 같이 중단된 코루틴의 실행이 종료된다.

```kotlin
suspend fun main() {
  println("Before")
    
  // 여기서 중단되면 main도 COROUTINE_SUSPENDED 반환
  myFunction() 
    
  // 재개후 실행됨
  println("After") 
}
// Before
// After
```

중단된 코루틴을 실행하던 스레드를 실행 가능한 코드가 사용할 수 있게된다.

> 만약 `delay` 호출이 `COROUTINE_SUSPEND`를 반환하지 않고 `Unit`을 반환하면 어떻게 될까?
> 그냥 중단 없이 다음 코드로 넘어가는 일반적인 함수 호출이 된다.

다음으로 컨티뉴에이션 객체다.

```kotlin
cont = object : ContinuatoinIm(continuation) {
  var result: Any? = null
  var label = 0
  
  override fun invokeSuspend(`$result`: Any?): Any? {
    this.result = `$result`;
    return myFunction(this);
  }
}
```

## 상태를 가진 함수

함수가 중단된 후 다시 사용할 지역 변수나 파라미터같은 상태를 가지고 있다면,
함수의 컨티뉴에이션 객체에 상태를 저장해야 한다.

```kotlin
suspend fun myFunction() {
  println("Before)
  var count = 0
  delay(1000) // 중단 함수
  counter++
  println("Counter: $counter)
  println("After)
}
```

counter 는 0 과 1로 표시된 두 상태에서 사용되므로 컨티뉴에이션을 통해 이를 저장해야 한다.
함수 내에 사용되던 값들은 중단 직전에 저장되고, 이후 함수가 재개될 때 복구된다.

## 값을 받아 재개되는 함수

중단 함수로부터 값을 받아야 하는 경우는 좀 더 복잡하다.

```kotlin
suspend fun printUser(token: String) {
  println("Before")
  val userId = getUserId(token) // 중단 함수
  println("Got userId: $userId")
  val userName = getUserName(userId, token) // 중단 함수
  println(User(userId, userName))
  println("After")
}
```

`getUserId` 와  `getUserName` 이라는 두 가지 중단 함수가 있다.
token 이라는 파라미터를 받으면 중단 함수는 특정 값을 반환한다.

함수가 재개되었다면 결과는 `Result.Success(value)` 가 되며, 이 값을 얻어 사용할 수 있다.
함수가 예외로 재개되었다면 결과는 `Result.Failuer(exception)` 이 되며 이 때는 예외를 던진다.

## 콜스택

코루틴을 재개할 때 콜 스택을 사용할수는 없다.
코루틴을 중단하면 스레드를 반환해 콜스택에 있는 정보가 사라지니까.
그래서 컨티뉴에이션 객체가 콜 스택의 역할을 대신 한다. 

서두에서 언급했듯  호출된 함수의 cont 는 호출한 함수의 cont 를 감싸면서 체인을 형성한다.

```kotlin
호출 순서: a() -> b() -> c()

// Continuation 체인
c.cont -> b.cont -> a.cont // 각각 이전 호출자를 참조

// 반환 순서
c 완료 → b resume → b 완료 → a resume → a 완료
```

## 중단 함수의 성능

일반적인 함수 대신 중단 함수를 사용하면 비용은 어떻게 될까?
코루틴 내부 구현을 보면 비용이 클 거라 생각하겠지만 실제로는 그렇지 않다.
지역변수를 복사하지 않고 새로운 변수가 메모리 내 특정 값을 가리키게 한다.
컨티뉴에이션 객체를 생성할 때 비용이 어느정도 들지만, 마찬가지로 큰 문제는 아니다.



![](cover.png)
