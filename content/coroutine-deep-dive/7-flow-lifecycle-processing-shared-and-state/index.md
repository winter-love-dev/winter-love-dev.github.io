---
title: 플로우 생명주기
date: '2026-03-17 00:10:00'
author: Winter
tags:
- Coroutine
categories: Coroutine
private: false
thumbnail: 'cover.png'
---

# 플로우 생명주기 함수

플로우의 생명주기별로 코드를 핸들링 하는 방법을 설명하는 장이다.

## onEach

플로우에 담긴 원소를 하나씩 받을수 있다.

```kotlin
flowOf(1, 2, 3, 4)
  .onEach { print(it) }
  . collect()
```

## onStart

onEach 와 다르게 플로우가 시작될 때 1회만 실행 된다.

## onComplete

플로우 실행이 완료 되었을 때 1회만 실행 된다.

onStart 일땐 로딩 활성화 이벤트를,
onComplete 일땐 로딩 숨김 이벤트를 트리거 하는 예시를 설명해주고 있다.

## onEmpty

원소를 내보내기 전에 플로우가 완료되면 실행된다.
처음에 뭔 말인지 이해를 못 했다. 
예제 코드는 이해 했는데, 어떻게 써먹을지 감이 확실히 안 왔다.

```kotlin
coroutineScope {
  flow<List<Int>> { delay(1000) }
   .onEmpty { emit(emptyList()) }
   .collect { println(it) }
}
// (1초 후)
// []
```

API 요청은 했는데 결과 값이 없으면, 
onEmpty {} 블록을 트리거 시켜서 
화면에 "결과 없음" 이벤트를 방출할 때 쓰이나?
이정도로 유추가 되었다.

## catch

Flow 실행중 예외 throw 가 발생하면 이 블록으로 전달된다.
예외 관련 로직을 처리할 때 활용한다.

안드로이드에서 예외를 보여주기 위해 활용 될 수 있다고 설명하고 있다.
onEmpty 와 마찬가지로 "결과 없음" 이벤트를 방출하거나
에러 관련 이벤트를 트리거 하는데 활용할 수 있다.

## 잡히지 않는 예외

try-catch 를 활용하는 예시를 설명하고 있다.

collect 블록 내부에서 예외가 발생하면, 예외를 잡지 못하게 되어 블록 밖으로 예외가 전달 되는데

이 때 보편적인 try-catch 를 사용해서 예외를 잡는 예시를 보여주고 있다.

collect 에서 예외를 발생시킬 여지가 있다면 

해당 코드를 onEach 로 옮긴 뒤 플로우의 catch 를 두라고 가이드 하고있다.

## flowOn

flow, onEach, onStart, onCompletion 과 같은 플로우 연산 람다 모두 중단 함수라고 한다.

중단 함수는 컨텍스트가 필요하고 부모와 관계를 유지한다.

플로우의 함수들은 collect 가 호출되는 곳에서 컨텍스트를 얻어온다.

`flowOn` 을 사용하면 일부 연산 람다의 코루틴 컨텍스트를 변경할 수 있다.

onEach, flowOn, onEach 이렇게 두 연산 사이에 flowOn 이 있다면,

flowOn 은 바로 위에 선언된 연산의 컨텍스트만 한정해서 컨텍스트를 변경 시켜줄 수 있다.

## launchIn

collect 는 플로우가 완료될 때까지 코루틴을 중단하는 중단 연산자이다.
그리고 coroutine launch 로 실행한다.
launchIn 이라는 확장 함수로 코루틴 스코프를 전달해서 collect 하는 방법도 있다.

## 정리

안드로이드에서 플로우를 사용하는 예시 코드로 마무리.

```kotlin
fun updateNews() {
  newsFlow()
    .onStart { showProgressBar() }
    .onCompletion { hideProgressBar() }
    .onEach { view.showNews(it) }
    .catch { view.handleError(it) }
    .launchIn(viewModelScope)
}
```

