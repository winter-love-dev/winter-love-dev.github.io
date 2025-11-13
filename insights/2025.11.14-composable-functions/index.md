---
insightPostId: composable-functions
insightPrivate: false
insightTitle: 1장 - Composable 함수들 (Composable functions) 내맘대로 정리
insightDate: '2025-11-14 00:10:00'
insightTags: ['Android', 'JetpackComposeInternals']
insightThumbnail: 'cover.png'
---

Jetpack Compose Internals 를 읽고 정리하는 글이다. 
이 글의 수준을 다음과 같이 설정했다.

대학생이나 현업 개발자 등 컴포즈를 평소보다 좀 더 깊이 있게 파고들고 싶은 자가 받아들일 수 있을 정도로 쉬운 난이도.

---

**Part 1: Composable 함수의 의미**

Composable 함수는 jetpack compose 의 가장 기본적인 요소이며 처음부터 올바른 관념으로 받아들이는게 좋다.
Composable 함수를 처음부터 제대로 이해하려면 일반 함수와 다른 관점으로 봐야 한다.
핵심: **Composable 함수 == 데이터를 트리 노드로 변환하는 함수**

일반 함수: 반환 값이 결과임
```kotlin
fun calculate(intput: Int) = Intput * 2
```

Composable 함수: 
```kotlin
@Composable fun Greeting(input: Input): Unit
```

Composable 함수가 실행되면 그 정보가 Node 로 저장된다 (1 함수 실행 == 1Node) Input 값이 바뀔때마다 함수는 새로 실행되는데 Side effect 라는 Action 이 실행된다.

Side effect 가 실행된다는 의미는 node 라는 data 를 emit 하여 In-memory Tree 에 등록(추가) 하는 Action 이 실행됨을 말함. Tree 구성 요소로 등록되는 과정을 Composition 이라고 부른다.

우리가 자주 부르는 단어인 ReComposition 도 이 관점에서 다시 이해해볼 수 있는 대목이다. 함수에 Input 되는 값이 바뀌었다 == 리컴포지션 됐다.

요약: “Composable을 실행한다” == “Composition”

- 실행 목적: 인메모리 트리를 생성 및 업데이트
- 데이터 변경 시 자동 재실행 → Tree 를 항상 최신 상태로 유지

Tree 업데이트 방식: 데이터 변경에 따라 Node를 삽입, 제거, 교체, 이동

---

**Part 2: Composable 함수의 속성** (좀 난해하게 느껴져서 받아들이는데 시간이 필요했다)

@Compose 어노테이션이 함수에 특정 제약/규칙을 부여함. 이 규칙 덕분에 Compose Runtime 이 최적화를 할 수 있음.
핵심은 @Composable 어노테이션의 의미는 “제약을 주는 대신 최적화를 얻는다”는 것.

@Composable 은 단순 마커가 아니라, 함수에 특정 규칙과 제약을 부여한다. 
이 규칙들 덕분에 Compose Runtime 은 코드 실행에 대한 “확실성”을 갖게 되고, 다양한 최적화 기법을 적용할 수 있다.

- 병렬 Composition: 독립적인 Composable 들을 동시에 실행
- 임의 순서 실행: 순서를 바꿔도 결과가 같으면 자유롭게 재배치
- 스마트 ReComposition: 변경된 부분만 재실행
- 위치 기억법 (Positional Memoization): 이전 결과를 재사용

왜 이게 가능한가? Composable 함수는 런타임이 “이 함수는 부수 효과가 없다”, “이 함수들은 서로 독립적이다” 같은것을 미리 확신할 수 있어야 최적화가 가능하다. 
위에 나열한 네 개의 항목에 대해 개발자가 “Yes” 라고 “확실성”을 전달할 수 있어야 비로소 최적화를 할 수 있는 조건이 성립된다. 
일반적인 Kotlin 함수는 형식이 자유로운 반면 Composable 함수는 "Yes" 라고 대답 해야될 제약 규칙을 지켜야 하는데, 그 대가로 많은 최적화를 얻을수 있게된다.

나중에 설명할 내용을 빼고 지금 이 얘기를 말하자니 너무 추상적이라 이게 뭔 소린가 싶다. 
나중에 알게될 내용을 지금 시점으로 미리 당겨와서 설명을 조금만 보충하자면, 
개발자는 선택적으로 “이 데이터는 앞으로 변하지 않을거야 (Like @Stabe, @Immutable)” 라는 "확실성" 정보를 컴파일러에게 미리 전달할 수 있다. 
Compose Runtime 은 정보를 바탕으로 Composable 실행을 최적화 하는거라고 일단 이정도만 이해하고 넘어가면 될 듯 하다.

---

**아직 Part 9 까지 남았다는 사실**

이번주는 일정상 전부 정리하긴 어려울 것 같으니 다음 주에 마저 정리하겠다.


![](./cover.png)
