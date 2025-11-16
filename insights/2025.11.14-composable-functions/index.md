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

**Composable 함수의 의미 (The meaning of Composable functions)**

Composable 함수는 Jetpack Compose 의 가장 기본적인 요소이며 처음부터 올바른 관념으로 받아들이는 게 좋다.
Composable 함수를 처음부터 제대로 이해하려면 일반 함수와 다른 관점으로 봐야 한다.

일반 함수: 반환 값이 결과임. 보통 한 번 실행되면 끝.
```kotlin
fun calculate(input: Int): Int = input * 2
```

Composable 함수: Node 데이터를 방출해서 컴포지션 하는것이 결과임. 입력 값의 변화에 따라 반복적으로 재실행됨.
```kotlin
@Composable fun Greeting(input: Input): Unit
```

컴포저블 함수의 실행 결과로 생성되는 데이터는 하나의 노드(Node)로 간주되어 방출(Emitting)하는 Action이 실행되고,
노드는 UI 를 나타내는 Composable 트리(Tree) 구조의 구성 요소로 업데이트 된다.
이 업데이트 동작은 우리가 컴포즈에서 흔히 접하는 용어인 "컴포지션(Composition)" 이라고 부르는 것이다. 

정리하면 컴포저블 함수를 실행하는 목적은 컴포지션을 통해 트리를 생성 및 업데이트하는 것이다. (컴포지션 유형: Node 를 트리의 구성 요소로 삽입, 제거, 교체, 이동)

다음은 Side Effect 에 관한 이야기다. 
컴포저블 함수는 Input 값이 바뀔 때마다 몇 번이고 재실행 된다.
재실행의 부수 효과(Side Effect)로 노드 방출이 일어나며 UI 트리는 항상 최신화 된다.

우리가 자주 접하는 단어인 Recomposition 도 이 대목에서 다시 이해해볼 수 있다.
함수에 Input 되는 값이 바뀌었다. 즉 리컴포지션 되었다.

**요약: Composable을 실행한다의 의미: Composition**

---

**Composable 함수의 속성 (Properties of Composable functions)**

`@Composable` 어노테이션은 단순 마커가 아니라 함수에 특정 제약과 규칙을 부여한다.
이 제약으로 Compose Runtime 은 코드 실행에 대한 “확실성”을 갖게 되고, 다음과 같은 최적화 기법이 적용된다.

- 병렬 Composition: 독립적인 Composable 들을 동시에 실행
- 임의 순서 실행: 순서를 바꿔도 결과가 같으면 자유롭게 재배치
- 스마트 Recomposition: 변경된 부분만 재실행
- 위치 기억법 (Positional Memoization): 이전 결과를 재사용

핵심: `@Composable` 어노테이션의 의미는 “제약을 주는 대신 최적화를 얻는다”는 것.

Composable 함수 최적화는 “이 함수는 부수 효과가 없다”, “이 함수들은 서로 독립적이다” 
같은것을 미리 확신할 수 있어야 특정 조건 및 동작을 추론할 수 있다.
이 확실성으로 다양한 실행 전략(execution strategy) 또는 평가 기법(evaluation techniques)에 따라 
사전에 특정 조건 및 동작을 추론하여 최적화 기법이 적용되는 것이다.

---

\* IR: Intermediate Representation, Kotlin 컴파일러가 소스파일을 해석하는 하나의 과정.
\* Composer: 런타임중 트리의 형태를 빌드하거나 업데이트하는 객체.
\* Compose Compiler: Kotlin 컴파일러 플러그인

**호출 컨텍스트 (Calling context)**

Compose Compiler 는 Composable 함수에 엄격한 제약을 하나 부과하는데,
Composable 함수는 오로지 다른 Composable 함수에서만 호출할 수 있다는 것이다.
때문에 코루틴처럼 호출 컨텍스트(Calling context)가 필수이다.

이 제약은 트리가 오직 Composable 함수로 구성되게 보장하게 된다.
또한 **Composer** 가 트리를 따라 하향 전달될 수 있다는 점 또한 보장된다.

**Compose Compiler** 는 컴파일 타임에 IR 을 가로채어 
우리가 작성한 원본 Composable 함수를 다른 코드로 변환한다.

원본 소스코드

```kotlin
@Composable
fun NamePlate(
    name: String, 
    lastname: String,
) {
    Column(
        modifier = Modifier.padding(16.dp),
    ) {
        Text(text = name)
        Text(
            text = lastname, 
            style = MaterialTheme.typography.subtitle1,
        )
    }
}
```

변환된 소스코드

```kotlin
fun NamePlate(
    name: String, 
    lastname: String, 
    $composer: Composer<*>, <- 추가
) {
    ...
    Column(
        modifier = Modifier.padding(16.dp), 
        $composer, <- 추가
    ) {
        Text(
            text = name,
            $composer, <- 추가
        )
        Text(
            text = lastname,
            style = MaterialTheme.typography.subtitle1,
            $composer, <- 추가
        )
    }
    ...
}
```

원본 소스코드에서 변환된 코드를 보면 **Composer** 라는 객체를 주입하는 파라미터가 추가된걸 알 수 있다.
그리고 내부에 선언된 `Column`, `Text` 에도 `$composer` 라는 객체가 전달되게 코드가 변환 되었는데,
Composer 라는 객체는 이와 같이 트리 내에서 모든 Composable 로 전달 되도록 변환되고
이것이 Compose Compiler 가 하는 일 중 하나이다.

Composer 의 실행 과정을 좀 더 자세히 풀어보면, 
Composable 함수가 실행되면 Node 를 트리로 방출(emitting)한다.
Input 값이 변경되면 Composable 함수가 재실행된다 (Recomposition)
Compose Runtime 은 트리를 하향 순회하면서 변경 사항을 확인한다.
이 때 트리의 형태를 빌드하거나 업데이트 하는 역할이 **Composer** 인 것.

---

**멱등성 (Idempotent)** 

멱등성: 같은 입력에 대해 항상 같은 결과를 내는 성질.

Composable 함수는 반드시 멱등성을 가져야 한다.
같은 입력값으로 여러번 실행해도 동일한 노드 트리를 생성해야 한다는 뜻이다.

멱등성이 중요한 이유는 Composable 의 핵심 최적화 기법인 **리컴포지션 스킵(Skip)** 때문이다.

Composable 함수는 입력값이 바뀌면 재실행(Recomposition) 된다. 
그런데 앱 전체를 매번 다시 그리면 UI 를 그리는 성능상 비효율적이다.

Compose Runtime 은 트리를 아래로 순회하면서 **입력값이 바뀐 노드만** 다시 실행하고
**입력값이 안 바뀐 노드는 건너뛴다(Skip)**

멱등성이 보장되면 Compose Runtime 은 다음과 같이 가정할 수 있게된다. 
"같은 입력값이면 같은 결과를 낼 것임",
"이미 메모리에 결과가 있으니 다시 실행 안해도 됨".
결과: Skip

이렇게 불필요한 재실행을 생략해서 성능을 최적화 한다.

---

**통제되지 않은 사이드 이펙트 방지 (Free of uncontrolled side effects)**

사이드 이펙트 (Side Effect):
호출되는 함수의 제어를 벗어나서 발생할 수 있는 예상치 못한 모든 동작.
로컬 캐시에서 데이터 읽기, 네트워크 요청 작업, 전역변수 설정 변경 등 예상치 못한 모든 동작.
즉 Composable 함수 내부적인 요인에 의해서만 발생하는게 아니라 외부 요인으로 인한 Side Effect 가 발생할 수 있다.

```kotlin
@Composable
fun EventsFeed(networkService: EventsNetworkService) {
    val events = networkService.loadAllEvents()
    LazyColumn {
        items(events) { event ->
            Text(text = event.name)
        }
    }
}
```
이 코드의 문제점: 함수가 호출될 때마다 네트워크 요청이 실행된다는 것이다.

앞서 언급했듯이 Composable 함수는 Input 값이 바뀌면 재실행된다.
그런데 재실행이 언제, 몇 번 일어날지는 Compose Runtime 이 결정한다. 우리가 통제할 수 없다.

예를 들어
- 화면 회전하면 재실행
- 다른 State 가 바뀌어도 재실행
- 심지어 최적화를 위해 멀티 스레드로 병렬 실행 가능

결과적으로 loadAllEvents() 가 우리 의도와 상관없이 수십 번 호출될 수 있다.
이게 바로 "통제되지 않은 사이드 이펙트" 문제다.

Compose Runtime 은 Composable 함수가 **예측 가능하기를(결정론적인)** 기대하는데
사이드 이펙트가 포함되면 예측이 불가능해진다.

또 다른 문제: 실행 순서 의존

```kotlin
@Composable
fun MainScreen() {
    Header()       
    ProfileDetail()
    EventList()    
}
```

`Header()` 가 먼저 실행되고, 그 다음 `ProfileDetail()` 이 실행되겠지? **"NO"**

Compose Compiler 는 이 함수들을 순서를 바꿔서 실행할 수도 있고 동시에 병렬로 실행할 수도 있다. 
따라서 Header 에서 변수 세팅하고, Profile 에서 읽기 같은 로직은 의도대로 작동하지 않는다.

그럼 어떻게 해야 하나? 우리는 모든 Composable 함수를 stateless 하게 만들수 있게 노력해야 한다.
Composable 함수는 최대한 "멍청하게" 만들어야 한다. 
모든 필요한 데이터는 파라미터로 받고, 함수 안에서는 받은 데이터로 UI 그리기만 하게 만들자.

그럼 네트워크 요청은 어디서 하나? Effect Handler 를 사용한다. 추후 챕터에서 다룰거라고 함.

정리:
- Composable 함수 안에서 네트워크 요청, DB 접근 같은 걸 직접 하면 안 됨.
- 왜? 함수가 언제든 여러 번 실행될 수 있어서.
- 해결책: Effect Handler 사용.

---

**재시작 가능 (Restartable)**

일반적인 코틀린 함수는 콜스택 (call stack) 상으로 단 한 번만 호출된다.
Composable 함수는 recomposition 으로 여러번 다시 시작될 수 있다.

Compose Runtime 은 Tree 를 항상 최신 상태로 유지하기 위해 어떤 노드를 재시작할지 선택적으로 판단한다.
Composable 함수는 관찰하는 상태(state)에 기반하여 반작용적으로 재실행되게 설계되었다.

Compose Compiler 는 State 를 읽는 (stateful) Composable 함수를 찾아 
Compose Runtime 에게 재시작 하는 방법을 알려주는 코드를 생성한다.
stateless 한 함수는 재시작할 필요가 없기 때문에 이런 Composable 함수엔 재시작 하는 방법을 가르쳐주지 않는다고 한다.

---

**빠른 실행 (Fast execution)**

Composable 함수들은 직접적으로 UI 를 구축하거나 반환하지 않는다.
Composable 은 단순히 Tree 구조를 구축 및 업데이트 하기위한 데이터(Node) 를 방출할 뿐이다.
이 매커니즘으로 Composable 은 빠르게 실행될 수 있고 Compose Runtime 이 몇 번이고 실행할 수 있게 해준다.
이 재실행 과정은 애니메이션의 각 프레임 만큼이나 자주 발생할수도 있다고 한다.

개발자가 지켜야 할 규칙: Compose Runtime 은 Composable 이 빠르게 실행된다고 가정한다.
따라서 Network, DB, 메모리 캐싱 등 비용이 큰 작업은 코루틴으로 처리 되어야 한다는 말임.
해당 작업들은 라이프 사이클에 대응할 수 있는 (lifecycle aware) 이펙트 핸들러에서 처리 되어야 하는데 이 내용은 나중에 다룬다고.

---

\* 메모이제이션 (Memoization): 
이전에 계산한 값을 메모리에 저장함으로써 동일한 계산의 반복 수행을 줄임, 캐싱의 한 유형.
함수형 프로그래밍 패러다임에서 널리 알려진 기술이며, 함수가 순수할 때만 이것을 사용할 수 있다.

**위치 기억법 (Positional memoization)**

위치 기억법: 함수 메모이제이션의 한 형태이다. 
순수한 함수(stateless)는 동일한 입력값에 대해 항상 동일한 결과를 반환할거라는 확실성이 있다.
동일한 입력값에 대해 함수가 호출될 때마다 다시 계산할 필요가 없다.


---

**아직 꽤 많은 내용이 더 남았다는 사실**

![](./cover.png)







