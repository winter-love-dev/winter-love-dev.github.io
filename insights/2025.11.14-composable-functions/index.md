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

### Composable 함수의 의미 (The meaning of Composable functions)

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

\* **Compose Runtime:** 실행 중에 UI 트리를 관리하고 최적화하는 시스템.<br/>

### Composable 함수의 속성 (Properties of Composable functions)

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

\* **Compose Compiler:** Kotlin 컴파일러 플러그인. Composable 함수를 변환하는 역할.<br/>
\* **IR:** Intermediate Representation, Kotlin 컴파일러가 소스파일을 해석하는 하나의 과정.<br/>
\* **Composer:** 런타임중 트리의 형태를 빌드하거나 업데이트하는 객체.<br/>

### 호출 컨텍스트 (Calling context)

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

### 멱등성 (Idempotent)

\* **멱등성:** 같은 입력에 대해 항상 같은 결과를 내는 성질.

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

### 통제되지 않은 사이드 이펙트 방지 (Free of uncontrolled side effects)

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

정리. Composable 함수 안에서 네트워크 요청, DB 접근 같은 걸 직접 하면 안 됨. 
왜? 함수가 언제든 여러 번 실행될 수 있어서. 

해결책: Effect Handler 사용.

---

### 재시작 가능 (Restartable)

일반적인 코틀린 함수는 콜스택 (call stack) 상으로 단 한 번만 호출된다.
Composable 함수는 recomposition 으로 여러번 다시 시작될 수 있다.

Compose Runtime 은 Tree 를 항상 최신 상태로 유지하기 위해 어떤 노드를 재시작할지 선택적으로 판단한다.
Composable 함수는 관찰하는 상태(state)에 기반하여 반작용적으로 재실행되게 설계되었다.

Compose Compiler 는 State 를 읽는 (stateful) Composable 함수를 찾아 
Compose Runtime 에게 재시작 하는 방법을 알려주는 코드를 생성한다.
stateless 한 함수는 재시작할 필요가 없기 때문에 이런 Composable 함수엔 재시작 하는 방법을 가르쳐주지 않는다고 한다.

---

### 빠른 실행 (Fast execution)

Composable 함수들은 직접적으로 UI 를 구축하거나 반환하지 않는다.
Composable 은 단순히 Tree 구조를 구축 및 업데이트 하기위한 데이터(Node) 를 방출할 뿐이다.
이 매커니즘으로 Composable 은 빠르게 실행될 수 있고 Compose Runtime 이 몇 번이고 실행할 수 있게 해준다.
이 재실행 과정은 애니메이션의 각 프레임 만큼이나 자주 발생할수도 있다고 한다.

개발자가 지켜야 할 규칙: Compose Runtime 은 Composable 이 빠르게 실행된다고 가정한다.
따라서 Network, DB, 메모리 캐싱 등 비용이 큰 작업은 코루틴으로 처리 되어야 한다는 말임.
해당 작업들은 라이프 사이클에 대응할 수 있는 (lifecycle aware) 이펙트 핸들러에서 처리 되어야 하는데 이 내용은 나중에 다룬다고.

---

\* **메모이제이션 (Memoization):**
캐싱의 한 유형. 이전에 계산한 값을 메모리에 저장함으로써 동일한 계산의 반복 수행을 줄임. <br/>
\* **위치 기억법:** 함수 메모이제이션의 한 형태이다.

### 위치 기억법 (Positional memoization)

함수 실행 결과를 캐싱해서 같은 입력에 대해 다시 계산하지 않는 기법.

일반적인 함수의 메모이제이션 방법: 함수의 이름, 타입, 파라미터의 조합으로 고유한 키를 생성하고 다시 실행될 때 이 키를 이용해서 메모이제이션 여부를 판단한다.

Composable 함수: 위의 일반적인 방법  + 소스 코드 위치(고유 키) 생성.
하지만 같은 함수여도 호출 위치가 다르면 UI Tree 상 다른 고유 키로 취급된다.

```kotlin
@Composable
fun MyComposable() { <- 부모 트리
   Text(”Hello”) // id 1
   Text(”Hello”) // id 2
   Text(”Hello”) // id 3
}
```

같은 `Text("Hello")`지만, 소스 코드 위치가 다르므로 각각 다른 ID를 받는다.
입력값이 바뀌지 않으면 이 id는 recomposition 시 Skip 될 수 있다.

```kotlin
@Composable
fun TalksScreen(talks: List<Talk>) {
  Column {
    for (talk in talks) {
      Talk(talk)
    }
  }
}
```

위 코드가 문제인 이유: Compose Runtime 입장에서 함수에 고유 ID 를 할당하기 어려운 케이스임.

처음엔 `Talk` 가 생성된만큼 ID 가 생성되어 각각의 `Talk` item 을 구분할 수 있긴 하다.
List 순서상 맨 끝에 새로운 item 이 추가 되어도 모든 item 은 각자의 고유한 ID 를 잘 유지할 수 있다.

문제는 List 순서상 중간의 아이템이 추가되거나 삭제 된다면? 
해당 위치 이후의 item 들은 Composable 의 위치가 바뀌며 각자의 고유 ID 를 잃게되고 결과적으로 전부 recomposition 된다.

업데이트가 생략 되었어야 할 Composable 함수들이 전부 recomposition 을 하게 되었으니 리스트가 길면 길수록 비효율적이게 된다.

```kotlin
@Composable
fun TalksScreen(talks: List<Talk>) {
  Column {
    for (talk in talks) {
      key(talk.id) { <- Unique key 추가
        Talk(talk)
      }
    }
  }
}
```

위의 방법처럼 Key 로 Composable 각자에 고유한 ID 를 직접 부여해서 트리 내 각자의 위치를 유지하게 할 수 있다.
위에 말한 비효율 문제를 해결할 수 있다.

```kotlin
@Composable
fun FilteredImage(path: String) {
  val filters = remember { computeFilters(path) }
  ImageWithFiltersApplied(filters)
}

@Composable
fun ImageWithFiltersApplied(filters: List<Filter>) {
  TODO()
}
```

`remember` 는 `computeFilters(path)` 를 실행하고 결과 저장, path 가 바뀌지 않으면 `remember` 에 저장된 값을 재사용.
해당 방법으로 recomposition Skip.

핵심: Composable 은 호출 위치로 고유 ID 를 가짐.
입력값의 변화가 없다면 해당 위치의 Composable 은 recomposition 을 Skip 한다. 
반복문에서는 `Key()` 로 명시적인 ID 지정 필요. 
함수 내부의 계산 결과를 캐싱하려면 `remember` 함수를 사용하자.

---

### Suspend 함수와의 유사성 (Similarities with suspend functions)

suspend 와 Compose 함수는 비슷한 제약을 가진다.

**Coroutine:** suspend 함수는 다른 suspend 함수에서 호출될 수 있다. <br/>
**Compose:** Composable 함수는 다른 Composable 함수에서 호출될 수 있다.

때문에 이 둘은 호출 컨텍스트가 필요하다.
이 제약으로 suspend 는 suspend 끼리, Composable 역시 Composable 끼리 묶일 수 있게 보장해준다.

```kotlin
// Coroutine 함수 변환 전
suspend fun publishTweet(tweet: Tweet): Post = ...

// Coroutine 함수 변환 후
fun publishTweet(
    tweet: Tweet, 
    callback: Continuation<Post> <- 추가
): Unit
```

둘 다 암시적인 파라미터를 추가한다는 점에서 유사하다.

핵심 차이점: <br/>
**Continuation:** Kotlin Runtime 으로부터 다양한 중단점에서 실행을 중단, 재개에 대한 정보를 담고 있는 객체. 본질적으론 일반 함수와 똑같이 한 번 실행되면 끝이다. <br/>
**Composer:** Compose Runtime 으로부터 여러번 실행되는 이벤트에 반응하며 항상 UI Tree 를 최신 상태로 유지하게 만들기 위한 객체.

"한 번 실행하고 중단, 재개 / 상태 변화에 반응해서 계속 재실행"

유사하긴 하지만 완전히 다른 문제를 해결하니 각자의 매커니즘이 필요하다.

---

### Composable 함수의 색깔 (The color of Composable functions)

서로 다른 종류의 함수는 잘 섞이지 않는다는 이야기다.

동기 함수에서 비동기 함수를 직접 호출할 수 없고, 일반 함수에서 suspend 함수를 직접 호출할 수 없듯이. 
그리고 일반 함수에서 Composable 함수를 직접 호출할 수 없듯이.

이렇게 함수들이 서로 다른 "색깔"을 가진 것처럼 분리되어 있다고 해서 함수 컬러링이라고 부른다.

Composable 함수는 다른 Composable 함수에서만 호출 가능하다. 일반 함수와 섞으려면 통합점이 필요하다 (예: `setContent`)

왜 이런 제약이 있을까? Composable 함수는 일반 함수와 완전히 다른 목적을 가지기 때문.

```kotlin
@Composable
fun SpeakerList(speakers: List) {
    Column {
        speakers.forEach { // 일반 함수인데?
            Speaker(it) // Composable 호출 가능
        }
    }
}
```

`forEach`는 일반 함수인데 어떻게 안에서 Composable을 호출할 수 있을까? **inline** 때문이라고 한다. `forEach` 같은 컬렉션 연산자는 inline 으로 선언되어 있다.
inline 함수는 호출 시점에 코드가 그대로 복사되어 들어간다. 결국 `Speaker(it)`는 `SpeakerList` 본문 안에서 호출되는 것과 같다. 둘 다 Composable이니까 문제없다.
inline 덕분에 함수 컬러링 문제를 우회하고 자연스러운 코드를 작성할 수 있다.

함수 컬러링은 문제일까? 오히려 장점이라고 한다. 컴파일러와 런타임이 "colored 함수"를 특별하게 처리할 수 있기 때문이다.

suspend 함수는 비동기 non-blocking 프로그래밍을 가능하게 한다.
Composable 함수는 재시작 가능(Restartable), 생략 가능(Skippable), 반응형(Reactive)이다.
일반 함수에는 없는 이런 특별한 기능을 얻는 대가로 "색깔"이라는 제약이 생긴 것이다.

---

### Composable 함수 타입 (Composable function types)

`@Composable` 어노테이션은 함수의 타입 자체를 변경한다.

일반 함수 타입: `(T) -> A` <br/>
Composable 함수 타입: `@Composable (T) -> A`

`@Composable`이 타입의 일부가 된다는 뜻이다.

Composable 람다: 일반 람다를 선언하듯이 Composable 람다도 선언할 수 있다.

```kotlin
// Composable 람다를 프로퍼티로 저장
val textComposable: @Composable (String) -> Unit = {
    Text(
        text = it,
        style = MaterialTheme.typography.subtitle1
    )
}

@Composable
fun NamePlate(name: String, lastname: String) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(text = name)
        textComposable(lastname)  // 저장한 람다 사용
    }
}
```

이렇게 Composable 람다를 재사용할 수 있다.

Scope가 있는 Composable 타입: 특정 Composable 안에서만 사용 가능하도록 범위를 제한할 수도 있다.

```kotlin
inline fun Box(
    content: @Composable BoxScope.() -> Unit  // BoxScope 안에서만
) {
    Layout(
        content = { BoxScopeInstance.content() },
        ...
    )
}
```

`BoxScope.() -> Unit`은 Box 안에서만 호출 가능한 람다를 의미한다.
이 덕분에 특정 Composable 내부에서만 쓸 수 있는 함수를 만들 수 있다.

왜 타입이 중요한가? 타입이 다르면 컴파일러가 다르게 처리할 수 있다.

`@Composable` 타입 덕분에 컴파일 시점에 잘못된 호출 검증 가능 (일반 함수에서 Composable 호출 시 에러), 
런타임이 Composable 함수를 특별하게 처리 가능 (재시작, Skip 등),
타입 시스템으로 제약을 강제할 수 있음.

Composable 함수가 일반 함수와 완전히 다른 타입인 이유다.

![](./cover.png)
