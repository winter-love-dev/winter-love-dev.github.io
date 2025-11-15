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

**호출 컨텍스트 (Calling context)**

Composable 함수의 속성은 대부분 **Compose Compiler**(Kotlin 컴파일러 플러그인) 에 의해 활성화된다. 
Kotlin 컴파일타임에 동작하며 Compose 컴파일러의 중간 표현인 IR 을 가로채어 모든 원본 Composable 함수를 변환한다.

Compose Compiler 에 의해 변환된 Composable 함수엔 `Composer` 라는 객체를 주입하는 파라미터가 추가된다.
모든 Composable 함수엔 런타임 때 Composer 객체를 주입 받게되며, 트리 내의 모든 수준에 접근할 수 있다.

```kotlin
@Composable
fun NamePlate(name: String, lastname: String) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(text = name)
        Text(text = lastname, style = MaterialTheme.typography.subtitle1)
    }
}
```

위의 코드는 아래와 같이 `Composer` 가 주입될 수 있게 변환된다.

```kotlin
fun NamePlate(name: String, lastname: String, $composer: Composer<*>) {
    ...
    Column(modifier = Modifier.padding(16.dp), $composer) {
        Text(
            text = name,
            $composer,
        )
        Text(
            text = lastname,
            style = MaterialTheme.typography.subtitle1,
            $composer,
        )
    }
    ...
}
```

Composer 는 이와 같이 트리 내에서 모든 Composable 로 전달된다.

Compose Compiler 가 Composable 함수에 부과하는 엄격한 규칙:
Composable 함수는 오로지 다른 Composable 함수에서만 호출될 수 있어서 호출 컨텍스트(calling context)가 필수이다. 
이 제약은 트리가 오직 Composable 함수로 구성되게 보장하고, `Composer` 가 트리를 따라 하향 전달될 수 있게 한다.

`Composer` 의 역할:
Composable 함수는 트리에 대한 변경사항을 전달하고, 
런타임 시에 트리의 형태를 빌드하거나 업데이트 하기위해 Composer 가 사용된다.

---

**멱등성 (Idempotent)**: 연산을 여러 번 적용하더라도 결과가 달라지지 않는 불가변의 성질.

Composable 함수가 생성하는 노드 트리는 명등성을 가져야 한다.
여러번 다시 실행하더라도 입력 값이 같다면 동일한 트리가 생성되어야 한다.
Compose Runtime 은 recomposition 과 같은 작업을 위해 멱등성이라는 가정에 의존한다.

recomposition 의 의미: 
입력값이 변경될 때마다 Composable 함수를 다시 실행하여 업데이트된 정보를 방출시키고 트리를 업데이트 하는 작업.

Compose Runtime 은 몇 가지 이유에 의해 Composable 함수를 recomposition 해줘야한다.

Recomposition 실행 과정: 트리를 아래로 순회하면서 어떤 노드를 재구성 해야되는지 확인한다. 
이 과정에서 입력값이 변경된 노드만 recomposition 을 하고 나머지는 생략한다.

Recomposition 생략 과정: 트리 순회 과정중 노드를 대표하는 Composable 함수가 멱등성의 성질을 가질때 생략된다.

Compose Runtime 이 동일한 입력값을 제공할 경우 동일한 결과를 생성할 수 있다고 가정하기 때문이다.
동일한 입력값에 대한 결과는 이미 메모리에 적재되어 있으므로 Compose 는 다시 실행할 필요가 없고, 결과적으로 생략할 수 있게된다.

---

통제되지 않은 사이드 이펙트 방지 (Free of uncontrolled side effects)

사이드 이펙트 (Side Effect):
호출되는 함수의 제어를 벗어나서 발생할 수 있는 예상치 못한 모든 동작.

사이드 이펙트로 간주되는 것:
로컬 캐시에서 데이터 읽기, 네트워크 요청 작업, 전역변수 설정 변경 등 예상치 못한 모든 동작.

Composable 함수는 결과를 생성하기 위해서 입력값에만 의존하게 되는것이 아니라 외부 요인에도 의존한다.

Compose Runtime 은 Composable 함수가 예측 가능하도록(결정론적인) 기대하기 때문에
Side Effect 가 포함된 Composable 함수는 예측이 어려워지고, 결과적으로 Compose 에게 좋지 않다.

사이드 이펙트는 Compose 내에서 아무 통제를 받지 않고 여러번 실행될 수 있다.
Composable 함수가 사이드 이펙트를 실행한다면 매 함수 호출 시마다 새로운 프로그램 상태를 생성할 수 있으므로
Compose Runtime 에게 필수적인 멱등성을 따르지 않게된다.

통제되지 않은 사이드 이펙트는 왜 문제일까?

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

Composable 함수는 Input 값이 바뀌면 재실행된다.
그런데 재실행이 언제, 몇 번 일어날지는 Compose Runtime 이 결정한다. 
우리가 통제할 수 없다.

예를 들어
- 화면 회전하면 재실행
- 다른 State 가 바뀌어도 재실행
- 심지어 최적화를 위해 멀티 스레드로 병렬 실행 가능

결과적으로 loadAllEvents() 가 우리 의도와 상관없이 수십 번 호출될 수 있다.
이게 바로 "통제되지 않은 사이드 이펙트" 문제다.

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

Compose Compiler 는 이 함수들을 순서 바꿔서 실행할 수도 있고 동시에 병렬로 실행할 수도 있다.
따라서 "Header 에서 변수 세팅하고, ProfileDetail 에서 읽기" 같은 로직은 이 의도대로 작동하지 않는다.

그럼 어떻게 해야 하나? 우리는 모든 Composable 함수를 stateless 하게 만들수 있게 노력해야 한다.
Composable 함수는 최대한 "멍청하게" 만들자. 모든 필요한 데이터는 파라미터로 받고, 함수 안에서는 받은 데이터로 UI 그리기만 하게 만들자.

핵심:
- Composable 함수 안에서 네트워크 요청, DB 접근 같은 걸 직접 하면 안 됨.
- 왜? 함수가 언제든 여러 번 실행될 수 있어서.
- 해결책: Effect Handler 사용.

---

**아직 몇 파트 더 남았다는 사실**

이번주는 일정상 전부 정리하긴 어려울 것 같으니 다음 주에 마저 정리하겠다.


![](./cover.png)







