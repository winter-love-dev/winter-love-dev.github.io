---
title: 코루틴 디스패처, 스코프, 공유 이슈, 테스트
date: '2026-02-23 00:10:00'
author: Winter
tags:
- Coroutine
categories: Coroutine
private: false
thumbnail: 'cover.png'
---

# 디스패처

디스패처를 통해 코루틴이 실행될 스레드풀을 선택할 수 있다.

## 기본 디스패처
`Dispatchers.Default`: 
디스패처를 설정하지 않으면 기본적으로 설정되는 디스패처. 
이 디스패처로 실행된 코루틴은 CPU 집약적인 연산을 하게된다.
기본적으로 컴퓨터의 CPU 개수만큼의 스레드풀 한도를 가지고 있다.
(8 Core CPU 라면 스레드 한도가 8개가 된다는 의미) 

## 기본 디스패처를 제한하기

`limitedParallelism()`: 
같은 시간에 특정 수 이상의 스레드를 사용하지 못하게 제한할 수 있다.

```kotlin
private val dispathcer = 
  Dispatchers.Default
    .limitedParallelism(5)
```

## 메인 디스패처

`Dispatchers.Main`:
안드로이드 기준, 기본 메인 디스패처로 사용한다.
코루틴을 메인 스레드풀에서 시작하게 설정한다.
복잡한 연산을 사용하지 않는다면 이 디스패처만으로 충분하다.

## IO 디스패처

`Dispatchers.IO`:
스레드 블로킹 상태를 만드는 (실행 결과를 기다리는) I/O 연산 상황에서 사용하기 위해 설계 되었다.

최적화를 위해 `Dispatchers.Default` 와 같은 스레드풀을 공유한다.
예를 들어 `Dispatchers.Default` 로 실행하는 도중에 
`withContext(Dispatchers.IO)` 까지 도달한 경우
스레드풀 전환 비용이 들지 않는다는 점에서 최적화 이점을 가져갈 수 있게 설계 되었다는 말이다.

`Dispatchers.IO` 의 사용 가능한 스레드 상한선은 64개로 설정되어 있다.
만약 CPU 코어 개수가 64개보다 많을 경우 
`Dispatchers.IO` 가 동시에 사용할 수 있는 스레드 개수의 상한선은 CPU 개수만큼 증가하게 된다.

## 커스텀 스레드풀을 사용하는 IO 디스패처

`Dispatchers.IO` 의 `limitedParallelism()` 함수는 독립적인 스레드 풀을 가진 새로운 디스패처를 만든다.
새로 만들어진 스레드풀은 64 개수 제한을 넘어, 100 개 의 스레드도 사용 가능하게 상한선을 늘릴수도 있다.

보통 스레드 블로킹이 잦은 클래스일 경우,
자기만의 스레드 한도를 커스텀하게 할당하기 위해 사용된다.

## 정해진 수의 스레드 풀을 가진 디스패처

자신만의 스레드풀을 만들어 직접 관리할수도 있다.

```kotlin
val NUMBER_OF_THREADS = 20
val dispatcher = Executors
  .newFixedThreadPool(NUMBER_OF_THREADS)
  .asCoroutineDispatcher()
```

하지만 이 방식의 문제점은 `close()` 함수로 닫지 않으면 메모리 누수가 발생할 수 있다.
스레드를 효율적으로 사용하지 않을수도 있다.
사용하지 않는 스레드가 다른 서비스와 공유되지 않고 살아있는 상태로 유지되기 때문.

## 싱글 스레드로 제한된 디스패처

다수의 스레드를 사용할 경우, 공유 상태로 인한 문제를 생각해야 한다.
1만 개의 코루틴이 `i` 프로퍼티를 1씩 증가 시키는 상황을 생각해보자.
동일 시간에 다수의 스레드가 `i` 프로퍼티에 접근하면 `i` 의 기대 결과 값은 1만보다 낮은 값을 가지게 된다. 

이러한 문제를 해결하기 위한 방법중 하나가 "싱글 스레드 디스패처" 를 만드는 것이다.

```kotlin
val dispatcher = Executors
  .newSingleThreadExecutor()
  .asCoroutineDispatcher()
```

하지만 이 역시 적절한 시점에 반드시 `close()` 해야하는 문제가 있다.
다른 방법으로 병렬 처리를 1로 제한한 
`Dispatchers.Default` or `Dispatchers.IO` (스레드를 블로킹 할경우) 디스패처를 만드는 것.

```kotlin
val dispatcher = 
  Dispatchers.Default
    .limitedParallelism(1)
```

단점으론 단 하나의 스레드만 가지고 있기 때문에 작업이 순차적으로 처리된다.
특히 이 스레드가 블로킹 되면 다른 모든 작업이 대기하게 된다.

## 프로젝트 룸의 가상 스레드 사용하기

중요한 내용은 아닌걸로 보여 패스

## 제한받지 않는 디스패처

`Dispatchers.Unconfined`: 스레드를 바꾸지 않는다. 
이 디스패처를 시작한 스레드에서 작업이 실행되고 재개된다. 
단위 테스트를 할 때 유용하다.

모든 작업이 같은 스레드에서 실행되기 때문에 연산의 순서를 쉽게 통제할 수 있다.
하지만 `runTest` 를 사용하면 이 방법이 필요 없다고 한다. (테스트 챕터에서 다룰 예정)

스레드 스위칭 비용이 발생하지 않는다는 점에서 성능적으로 가장 저렵한 디스패처이다.

스레드에 대해 전혀 신경쓰지 않아도 될 때 사용하면 되지만
실제 개발 환경은 그럴 일이 없으니 잘 사용하지 않는다.  
잘못 사용하면 전체 앱을 블로킹 하는 사고가 날 수 있다.

## 메인 디스패처로 즉시 옮기기

코루틴을 배정하는 것에도 비용이 든다고 한다.

그리고 아래 예제처럼 함수가 이미 메인 디스패처에서 호출이 되었다면
다시 배정하는데 쓸데없는 비용이 발생 된다.

```kotlin
suspend fun showUser(user: User) =
  withContext(Dispatchers.Main) {
    userNameElement.text = user.name
  }
```

`withContext` 때문에 사용자 데이터는 약간의 추가 지연이 발생할 수 있다.
실행되고 있던 코루틴이 다른 코루틴을 시작하고, 해당 코루틴을 기다려야 한다는 점에서 쓸데없는 비용 발생이란 것이다.

이런 경우를 방지하기 위해 반드시 필요한 경우에만 스레드를 배정하는 `Dispatchers.Main.immediate` 가 있다.
메인 스레드에서 아래 함수를 호출하면 스레드 배정 없이 즉시 실행된다.

```kotlin
suspend fun showUser(user: User) = 
  withContext(Dispatchers.Main.immediate) {
    userNameElement.text = user.name
  }
```

참고로 `viewModelScope` 의 기본 디스패처가 `Dispatchers.Main.immediate` 이다.

만약 `BaseUseCase` 같은 베이스 클래스에 
항상 `withContext(Dispatchers.IO)` 로 시작 되게끔 로직을 설계 했다면,
그리고 이 베이스를 통해 실행하는 연산이 레트로핏, 룸을 통한 일이라면 
쓸데없는 스레드 전환 비용이 발생할 것이다.
왜냐하면 이들은 자체적인 스레드풀을 가지고 실행되기 때문이다.

`immediate`는 구글에서 만든것. 
`immediate` 의 필요성에 대한 논쟁이 있었다.
결론: `immediate` 를 쓰는게 좋다.

## 컨티뉴에이션 인터셉터

`ContinuationInterceptor`: 
코루틴이 중단 되었을때 컨티뉴에이션 객체를 수정하고, 종료 되었을때 호출하는 핸들러를 사용할 수 있는 코루틴 컨텍스트.

`runTest` 에도 똑같은 컨텍스트를 사용하고 있다고 하니 테스트 챕터에서 다시 확인해보자.

## 작업의 종류에 따른 각 디스패처의 성능 비교

위에서 언급한 상황별 디스패처를 잘 선택하자는 이야기다.

CPU 집약적 작업? `Dispatchers.Default`

블로킹 연산 작업? `Dispatchers.IO`

# 코루틴 스코프 만들기

## CoroutineScope 팩토리 함수

코루틴 스코프 인터페이스를 구현한 클래스를 만들고 내부적으로 코루틴 빌더를 직접 호출할 수 있다.
하지만 이 방법보단 코루틴 스코프 객체를 프로퍼티로 가지고 있다가 코루틴 빌더를 호출하는 방법이 더 선호 된다고 한다.

## 안드로이드에서 스코프 만들기

BaseUseCase 에 코루틴 스코프 객체와 컨텍스트를 프로퍼티로 가지고 있다가
`onCleared` 시점에 Job을 `cancel` 하는 활용 사례를 소개하고 있다.

## viewModelScope 와 lifecycleScope

스코프를 따로 정의하는 대신 이미 만들어진 이 두 가지 스코프를 활용할 수 있다는 내용이다.
`Dispatchers.Main` 과 `SupervisorJob`을 사용하고, 
뷰모델이나 라이프사이클이 종료 되었을때 잡을 취소되는 등 안드로이드 작업시 필요한 설계들이 이미 이 스코프에 담겨있다.

뷰모델스코프의 디스패처가 `Dispatchers.Main.immediate` 를 사용해서 
스레드 전환 비용 최적화를 고려한 설계가 눈에 띈다.

## 백엔드에서 코루틴 만들기

패스

## 추가적인 호출을 위한 스코프 만들기

exceptionHandler 로 예외를 전달하고 크래시리틱스 로그를 저장하는 활용 사례를 소개하고 있다.

# 공유 상태로 인한 문제 !!!!! Critical Section !!!!! 동작 방식 반드시 알고 있어야 한다.

동시 호출되는 경우가 고려되지 않은 UserRepository 예제 코드를 소개하고,
이를 해결하기 위한 방법들을 소개 할거라고 한다.

## 동기화 블로킹

`synchronized {}` 블록으로 스레드를 블로킹 해서 동시 호출 상황을 대비하는 방법을 소개하고 있다.
이 블록 내부에선 중단 함수를 호출할 수 없다. 
코루틴이 자기 차례를 기다리느라 스레드를 블로킹 하는 문제도 있다.
블로킹 없이 중단하는 등 코루틴에 특화된 방법을 사용해야 한다.

## 원자성 !!!!!!! 중요

AtomicInteger, AtomicReference 등 원자성 연산을 활용한 사례를 설명하고 있다.

(중요) Atomic 의 단점: 복잡하게 원자값을 다뤄야 하는 경우

## 싱글 스레드로 제한된 디스패처

디스패처 챕터에서 스레드 수를 1개로 제한했던 사례를 다시 언급하고 있다.

## 뮤텍스

첫 번째 코루틴이 `Mutex` 의 `withLock` 블록을 통해 `lock` 되고, 
`unlock` 으로 락 상태를 풀기 전까진 두 번 째 코루틴이 실행되지 못하고 기다리게 만드는 방법을 소개하고 있다.  

## 세마포어

`Mutex` 가 하나 이상의 접근을 막는다면 세마포어는 둘 이상이 접근할 수 있는 방법이다.
공유 상태로 인해 생기는 문제를 해결할 수는 없지만 
동시 요청을 처리하는 수를 제한할 때 활용할 수 있다.
처리율 제한 장치를 구현할 때 도움이 된다.

# 코틀린 코루틴 테스트하기

## 시간 의존성 테스트하기
## TestCoroutineScheduler 와 StandardTestDispatcher
## runTest
## 백그라운드 스코프
## 취소와 컨텍스트 전달 테스트하기
## UnconfinedTestDispatcher
## 목(mock) 사용하기
## 디스패처를 바꾸는 함수 테스트하기
## 함수 실행 중에 일어나는 일 테스트하기
## 새로운 코루틴을 시작하는 함수 테스트하기
## 메인 디스패처 교체하기
## 코루틴을 시작하는 안드로이드 함수 테스트하기
## 룰이 있는 테스트 디스패처 설정하기


![](cover.png)
