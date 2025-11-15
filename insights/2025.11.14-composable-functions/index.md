---
insightPostId: composable-functions
insightPrivate: false
insightTitle: 1장 - Composable 함수들 (Composable functions) 내맘대로 정리
insightDate: '2025-11-14 00:10:00'
insightTags: ['Android', 'JetpackComposeInternals']
insightThumbnail: 'cover.png'
---

Jetpack Compose Internals 를 읽고 정리하는 글이다. 
어쩌다보니 올해 안에 완독 하겠다는 목표를 세워서 [(관련글)](https://winter-love.dev/insights/compose-internals) 열심히 읽는중이다.
이 글의 수준을 다음과 같이 설정했다. 
대학생이나 현업 개발자 등 컴포즈를 평소보다 좀 더 깊이 있게 파고들고 싶은 자가 받아들일 수 있을 정도로 쉬운 난이도.

---

**Composable 함수의 의미**

Composable 함수는 Jetpack Compose 의 가장 기본적인 요소이며 처음부터 올바른 관념으로 받아들이는 게 좋다.
Composable 함수를 처음부터 제대로 이해하려면 일반 함수와 다른 관점으로 봐야 한다.

일반 함수: 반환 값이 결과임. 보통 한 번 실행되면 끝임.
```kotlin
fun calculate(input: Int): Int = input * 2
```

Composable 함수: 컴포지션을 생성/업데이트하는 것이 결과임. 입력 값의 변화에 따라 반복적으로 실행됨.
```kotlin
@Composable fun Greeting(input: Input): Unit
```

컴포저블 함수의 실행 결과로 생성되는 데이터는 하나의 노드(Node)로 간주되어 방출(Emitting)하는 Action이 실행되고,
노드는 UI 를 나타내는 Composable 트리(Tree) 구조의 구성 요소로 업데이트 된다.
이 업데이트 동작은 우리가 컴포즈에서 흔히 접하는 용어인 "컴포지션(Composition)" 이라고 부르는 것이다. 

정리하면 컴포저블 함수를 실행하는 목적은 컴포지션을 통해 트리를 생성 및 업데이트하는 것이다. (컴포지션 유형: Node 를 트리의 구성 요소로 삽입, 제거, 교체, 이동)

다음은 Side Effect 에 관한 이야기다. 
컴포저블 함수는 Input 값이 바뀔 때마다 몇 번이고 재실행 된다.
재실행의 부수 효과로 노드 방출이 일어나며 UI 트리는 항상 최신화 된다.

우리가 자주 접하는 단어인 ReComposition 도 이 대목에서 다시 이해해볼 수 있다.
함수에 Input 되는 값이 바뀌었다. 즉 리컴포지션 되었다.

**요약: Composable을 실행한다의 의미: Composition**

---

**Composable 함수의 속성**

`@Composable` 어노테이션은 단순 마커가 아니라 함수에 특정 제약과 규칙을 부여한다는 특성이 있다.
이 특성 덕분에 Compose Runtime 은 코드 실행에 대한 “확실성”을 갖게 되고, 다음과 같은 최적화 기법이 적용된다.

- 병렬 Composition: 독립적인 Composable 들을 동시에 실행
- 임의 순서 실행: 순서를 바꿔도 결과가 같으면 자유롭게 재배치
- 스마트 ReComposition: 변경된 부분만 재실행
- 위치 기억법 (Positional Memoization): 이전 결과를 재사용

핵심: `@Composable` 어노테이션의 의미는 “제약을 주는 대신 최적화를 얻는다”는 것.

Composable 함수 최적화는 “이 함수는 부수 효과가 없다”, “이 함수들은 서로 독립적이다” 같은것을 미리 확신할 수 있어야 최적화가 가능하다. 
위에 나열한 네 개의 항목에 대해 개발자가 “Yes” 라고 “확실성”을 전달할 수 있어야 
비로소 런타임이 특정 조건 및 동작을 추론하여 최적화 기법이 적용되는 것이다.

자세한 건 다음에 알아볼 Composable 속성에서 확인할 수 있다.

---

**아직 Part 9 까지 남았다는 사실**

이번주는 일정상 전부 정리하긴 어려울 것 같으니 다음 주에 마저 정리하겠다.


![](./cover.png)
