---
title: 1부 - 코틀린 코루틴 이해하기
date: '2026-02-01 00:10:00'
author: Winter
tags:
- Coroutine
categories: Coroutine
private: false
thumbnail: 'cover.png'
---

### Point

**챕터 브리핑:** 해당 회차의 핵심 개념 요약
**실무 대입 토론:** 직접 격어본 사례, 혹은 어떻게 응용할건지 논의
**라이브 코딩 및 검증:** 헷갈리는 부분을 간단한 샘플 코드 작성을 통해 이해하기

**핵심 주제 및 논의 포인트**: 중단(Suspension)의 원리와 컴파일러가 생성하는 상태 머신(Continuation) 구조 분석

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

코루틴은 중단 되었을 때 Continuation 객체를 반환한다.
이 객체는 게임을 저장하는 것과 비슷하다. 
Continuation 을 이용하면 멈췄던 곳에서 다시 코루틴을 실행할 수 있다.
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
    suspendCoroutine<Unit> { continuation ->
        continuation.resume()
    }
    println("After")
}
// Before
// After
```

Continuation 객체를 사용해서 코루틴을 중단한 후 곧바로 실행할 수 있다.
continuation 에서 resume 을 초훌했기 때문에 After 를 호출할 수 있게 되었다.

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



![](cover.png)
