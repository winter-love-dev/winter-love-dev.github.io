---
title: 2장 - Compose 컴파일러 (The Compose compiler)
date: '2025-11-23 00:10:00'
author: Winter
tags:
  - Android
  - JetpackComposeInternals
categories: ComposeInternals
private: false
thumbnail: 'cover.png'
---

Jetpack Compose Internals 를 읽고 정리하는 글이다. 
어쩌다보니 올해 안에 완독 하겠다는 목표를 세워서 [(관련글)](https://winter-love.dev/insights/compose-internals) 열심히 읽는중이다.
이 글의 수준을 다음과 같이 설정했다. 
대학생이나 현업 개발자 등 컴포즈를 평소보다 좀 더 깊이 있게 파고들고 싶은 자가 받아들일 수 있을 정도로 쉬운 난이도.

---

참고. compose architecture

![](0.png)

---

\* **Compose Compiler:** Kotlin 컴파일러 플러그인. Composable 함수를 변환하는 역할.<br/>

# Compose 컴파일러 (The Compose compiler)

Kotlin 에서 코드 생성이라고 하면 보통 kapt, KSP 를 떠올린다. 
하지만 Compose Compiler 는 KSP 같은 어노테이션 프로세서가 아니라 "Kotlin 컴파일러" 의 플러그인이다.

**둘의 차이:** <br/>
KSP: 컴파일 전에 실행. 새 코드만 추가 가능. <br/>
컴파일러 플러그인: 컴파일 중에 실행. 기존 코드 수정 가능. <br/>

[이전 1장 글에서 봤던 Composer 파라미터 주입](https://winter-love.dev/composeinternals/1-composable-functions/#%ED%98%B8%EC%B6%9C-%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8-calling-context)
이 바로 "기존 코드 수정"의 예시다. KSP 로는 불가능.

Compose Compiler 는 IR (Intermediate Representation) 단계에서 코드를 변환한다.
IR 은 소스 코드가 최종 결과물로 변환되기 전 중간 단계다. 
이 단계에서 Compose Compiler 는 우리가 작성한 Composable 함수를 Runtime 이 원하는 형태로 마음대로 바꿔버린다.

예를 들어 우리가 작성한 `fun Header()` 는 컴파일 후에는 `fun Header($composer: Composer)` 로 변환된다. 
이게 IR 변환이다.

핵심: IR 단계에서 코드를 변환하니까 우리 눈에 안 보이는 일들이 일어날 수 있다.

@Composable 어노테이션은 단순 마커가 아니다. 함수의 타입 자체를 바꾼다.

일반 함수 타입: (String) -> Unit <br/>
Composable 함수 타입: @Composable (String) -> Unit <br/>

타입이 다르니까 컴파일러가 규칙을 강제할 수 있다. 
일반 함수에서 Composable 함수를 호출하면 컴파일 에러가 나는 이유다.
그럼 타입을 바꾸면 뭐가 좋은가? Composable 함수에게 "메모리"가 생긴다.

"메모리"가 생긴다는 의미: @Composable 이 붙으면 그 함수는 다음 능력들을 얻는다.

remember 사용 가능 (값을 기억할 수 있음), Composer 와 슬롯 테이블 사용 가능, 
고유한 ID 를 할당받음 (1장의 위치 기억법), 트리 내 위치를 가짐, 
라이프사이클을 가짐 (recomposition 되어도 상태 유지 가능).

이 모든 게 "메모리"다. 
Composable 함수가 실행될 때마다 매번 새로 시작하는 게 아니라, 이전 실행을 "기억"하고 있다는 뜻이다.
결과적으로 Composable 함수는 노드를 방출해서 트리를 구성할 수 있게 된다.

요약: @Composable 은 타입을 바꾸고, 타입이 바뀌면 메모리를 갖게 되고, 메모리가 있으니까 트리의 일부가 될 수 있다.

---

# Compose 어노테이션들 (Compose annotations)

Compose Compiler가 코드를 변환하려면 먼저 어떤 함수가 Composable인지, 어떤 최적화를 적용해야 하는지 알아야 한다.
이를 위해 어노테이션을 사용한다.

**Compose Compiler의 작동 시점**

Compose Compiler는 Kotlin 컴파일 과정 중 프론트엔드 단계에서 동작한다.
이 단계에서 소스 코드를 분석하고 검증한다.

컴파일러가 확인하는 것들: `@Composable` 어노테이션이 붙은 함수들을 찾기, 
Composable 함수가 제약을 잘 지키고 있는지 검증 (다른 Composable에서만 호출되는지 등),
타입 시스템이 Composable 함수를 일반 함수와 다르게 처리하도록 만들기

**추가 어노테이션들**

`@Composable` 외에도 Compose는 여러 어노테이션을 제공한다.
이 어노테이션들은 특정 상황에서 추가 검사를 하거나 런타임 최적화를 활성화하는 역할을 한다.

예를 들어 어떤 함수는 결과를 캐싱해도 되고, 어떤 함수는 안정적인 입력만 받아야 하고, 
어떤 함수는 리컴포지션을 Skip해도 된다는 힌트를 컴파일러에게 줄 수 있다.

이런 어노테이션들은 모두 Compose Runtime 라이브러리에서 제공된다.

---

# @Composable

가장 중요한 어노테이션이다. 
1장에서 이미 다뤘지만, 컴파일러 관점에서 다시 한번 정리한다.

**Compose Compiler vs 어노테이션 프로세서**

일반적인 어노테이션 프로세서: 새로운 코드만 생성 가능, 기존 코드를 직접 수정할 수 없음.

**Compose Compiler:** IR(중간 표현)을 직접 변환, 기존 코드를 수정할 수 있음.

`@Composable` 어노테이션이 붙으면 컴파일러가 해당 함수를 직접 변환한다.
가장 중요한 변경은 **함수의 타입이 바뀐다**는 것이다.

**타입 변경으로 얻는 것들**

타입이 바뀌면 컴파일러가 Composable 함수에 특별한 제약을 강제할 수 있다.
Composable 함수는 다른 Composable 함수에서만 호출 가능하다는 규칙 같은 것들 말이다.

하지만 제약만 생기는 게 아니다. `@Composable`을 통해 함수는 "메모리"를 갖게 된다.

메모리를 가진다는 의미: 
`remember`를 사용해서 값을 저장하고 재사용할 수 있음, 
`Composer`와 슬롯 테이블을 활용할 수 있음, 
라이프사이클을 가짐 (리컴포지션 되어도 상태 유지 가능),
고유한 정체성(ID)을 부여받음 ([위치 기억법에서 다뤘음](https://winter-love.dev/composeinternals/1-composable-functions/#%EC%9C%84%EC%B9%98-%EA%B8%B0%EC%96%B5%EB%B2%95-positional-memoization)),
노드를 Composition으로 방출할 수 있음,
CompositionLocals 처리 가능.

**Composable 함수의 본질**

Composable 함수는 데이터를 트리의 노드로 변환한다.
이 노드가 UI 노드일 수도 있고, 다른 종류의 노드일 수도 있다.

Compose Runtime은 UI에만 국한되지 않는다.
범용적인 트리 구조를 다루는 시스템이며, 우리가 어떻게 사용하느냐에 따라 UI가 될 수도, 다른 무언가가 될 수도 있다.

---

# @ComposableCompilerApi

Compose 컴파일러 전용 API라는 것을 표시하는 어노테이션이다.
"이건 컴파일러가 내부적으로 쓰는 거니까 일반 개발자는 건드리지 마셈"이라는 경고 표시다.

---

# @InternalComposeApi

Compose 내부에서만 사용하는 API라는 표시다.

Kotlin의 `internal` 키워드는 같은 모듈 안에서만 접근 가능하다.
하지만 Compose는 여러 모듈로 나뉘어 있어서 모듈 간에 내부 API를 공유해야 할 때가 있다.

`@InternalComposeApi`는 이런 경우에 사용한다.
"Compose 내부에서는 쓰지만, 외부 개발자는 쓰지 마세요. 언제든 바뀔 수 있어요"라는 의미다.

stable 버전에 포함되어도 내부 구현은 계속 바뀔 수 있기 때문에 이런 표시가 필요하다.

---

# @DisallowComposableCalls

특정 람다 안에서 Composable 함수 호출을 금지하는 어노테이션이다.

**왜 필요한가?**

대표적인 예시가 `remember`다.

```kotlin
@Composable
inline fun  remember(
    calculation: @DisallowComposableCalls () -> T
): T = currentComposer.cache(false, calculation)
```

`remember`는 `calculation` 람다를 최초 1회만 실행하고 결과를 저장한다.
recomposition 시에는 저장된 값을 그냥 반환한다.

만약 `calculation` 안에서 Composable 함수를 호출하면 어떻게 될까?

```kotlin
val data = remember {
    Text("Hello")  // 🚨 만약 가능하다면?
}
```

`forEach`의 람다는 `@Composable`로 표시되어 있지 않지만,
`MyScreen`이 Composable이므로 안에서 `Text`를 호출할 수 있다.

이건 `forEach` 같은 경우에는 유용하지만, `remember` 같은 경우에는 문제가 된다.
그래서 명시적으로 금지해야 한다.

**전파성**

`@DisallowComposableCalls`가 붙은 람다 안에서 또 다른 inline 람다를 호출하면,
컴파일러는 그 람다에도 `@DisallowComposableCalls`를 요구한다.

```kotlin
val result = remember {
    list.map { item -> item * 2 }  // map의 람다도 금지됨
}
```

이 어노테이션은 주로 Compose Runtime 같은 라이브러리를 만들 때 사용한다.
일반 앱 개발에서는 거의 쓸 일이 없다.

---

# @ReadOnlyComposable

`@ReadOnlyComposable` 이 붙은 Composable 함수는 composition 에 쓰지 않고 읽기만 한다는 의미다. 
본문 내 중첩된 모든 Composable 호출에도 적용된다.
일반적인 Composable 함수는 컴파일러가 본문을 "그룹" 으로 감싸서 방출한다. 
그룹은 나중에 recomposition 할 때 데이터를 어떻게 정리하거나 이동시킬지에 대한 정보를 담고 있다.

그룹이 뭔가? 텍스트에서 시작과 끝을 가리키는 두 개의 포인터를 떠올려보자.
모든 그룹에는 소스 코드 위치 키가 있고, 이 키로 위치 기억법을 적용할 수 있다.

```kotlin
if (condition) {
    Text("Hello")
} else {
    Text("World")
}
```

둘 다 Text 함수지만 if 와 else 는 서로 다른 고유성을 가진다. 
그룹의 키가 이 고유성을 구분한다. 
이동 가능한 그룹은 고유한 키를 가지고 있어서 부모 그룹 내에서 재정렬될 수 있다.

그런데 composition 에 쓰이지 않는 Composable 은 데이터가 교체되거나 이동되지 않으므로 그룹이 필요없다. 
@ReadOnlyComposable 은 이런 불필요한 코드 생성을 방지한다.

실제 예시로는 CompositionLocal 을 통해 읽는 값들이 있다. 
Material 라이브러리의 Colors, Typography, isSystemInDarkTheme() 함수, LocalContext, LocalConfiguration 등이다. 
이런 값들은 단순히 읽기만 하지 쓰지 않는다.

핵심: 읽기만 하는 Composable 은 그룹이 필요없으니 성능 최적화를 위해 명시한다.

---

# @NonRestartableComposable

@NonRestartableComposable 이 붙으면 해당 Composable 함수는 재시작이 불가능해진다.
모든 Composable 이 기본적으로 재시작 가능한 건 아니다. 
인라인 Composable 이나 반환 타입이 Unit 이 아닌 Composable 은 원래 재시작할 수 없다.
이 어노테이션을 추가하면 컴파일러가 recomposition 중에 함수를 재구성하거나 생략하는 데 필요한 보일러플레이트 코드를 생성하지 않는다.
언제 쓰나? 다른 Composable 에 의해 recomposition 될 가능성이 희박한 경우다. 
논리가 거의 없어서 스스로 invalidation 시키는 게 의미 없는 함수들이다. 
이런 함수는 상위 Composable 에 의해서만 recomposition 되면 충분하다.
실제 사용 사례는 매우 드물다. 
정확성을 위해 필요한 건 아니지만, 특수한 경우에 성능 최적화 기법으로 사용할 수 있다.

핵심: 재시작이 필요없는 Composable 에 붙여서 불필요한 코드 생성을 방지한다.

---

# @StableMarker

Compose Runtime 은 타입의 안정성을 나타내기 위해 몇 가지 어노테이션을 제공한다. `@StableMarker`, `@Immutable`, `@Stable`.

`@StableMarker` 는 `@Immutable` 과 `@Stable` 에 사용되는 메타 어노테이션이다. 
어노테이션을 위한 어노테이션이라고 보면 된다.

`@StableMarker` 로 마킹된 타입은 다음 요구 사항을 만족해야 한다.

equals 결과가 동일한 두 인스턴스에 대해 항상 동일하다,
public 프로퍼티가 변경되면 composition 에 알린다,
모든 public 프로퍼티가 안정적이다.

이 요구사항을 만족하면 컴파일러가 최적화할 수 있다.
입력값이 안 바뀌었다는 걸 확신할 수 있으므로 recomposition을 Skip할 수 있다.

`@Immutable` 이나 `@Stable` 로 마킹된 모든 타입도 위 요구 사항을 만족해야 한다. 
둘 다 `@StableMarker` 를 사용하기 때문이다.

중요한 건 이게 컴파일러에게 하는 "약속" 이라는 점이다. 
컴파일 시 유효성 검사를 하지 않는다. 
요구 사항을 충족하는지는 개발자가 책임진다.

대부분의 경우 Compose Compiler 가 알아서 타입의 안정성을 추론한다. 
굳이 어노테이션을 달지 않아도 컴파일러가 안정적인 타입으로 취급한다는 뜻이다.

하지만 두 가지 경우엔 명시적으로 달아야 한다.

인터페이스나 추상 클래스에서 구현체가 반드시 안정적이어야 한다고 강제하고 싶을 때. 
이 어노테이션은 컴파일러와의 약속이자 구현을 위한 요구 사항이 된다.

구현체가 내부적으로 mutable 하지만 public API 는 안정적이어서 안정적인 타입으로 취급하고 싶을 때. 
예를 들어 내부 캐시는 변하지만 외부로 보이는 값은 변하지 않는 경우다.

핵심: @StableMarker 는 타입의 안정성을 컴파일러에게 약속하는 메타 어노테이션이다.

---

# @Immutable

한번 생성되면 절대 변하지 않는 타입을 표시하는 어노테이션이다.

**val보다 강력한 약속**

Kotlin의 `val`은 재할당을 막지만, 불변성을 보장하진 않는다.
`val`로 선언된 프로퍼티가 mutable한 데이터 구조를 참조하면 내용은 바뀔 수 있다.

`@Immutable`은 이것보다 훨씬 강력하다.
생성 후 모든 public 프로퍼티가 절대 안 바뀐다는 약속이다.

Kotlin은 언어 차원에서 불변성을 보장하는 메커니즘이 없기 때문에 이 어노테이션이 필요하다.

**사용 조건**

다음 조건을 모두 만족하는 클래스에 사용할 수 있다:

모든 프로퍼티가 `val`, 커스텀 getter가 없음 (매번 다른 값을 반환할 수 있으니까), 모든 프로퍼티가 불변 타입 (primitive 타입 또는 `@Immutable` 타입).

대표적인 예시는 모든 프로퍼티가 `val`인 데이터 클래스다.

**최적화 효과**

Compose Runtime은 `@Immutable` 타입을 보면 값이 절대 안 바뀐다고 가정한다.
이 확신 덕분에 스마트 recomposition과 recomposition Skip 같은 최적화를 적극적으로 할 수 있다.

**@StableMarker와의 관계**

`@Immutable`은 `@StableMarker`를 포함한다.
불변 타입은 외부로 노출된 값이 절대 변경되지 않기 때문에, `@StableMarker`의 모든 요구사항을 자동으로 만족한다.

불변 타입은 값이 변경되지 않으므로 composition에게 변경을 알릴 필요도 없다.

---

# @Stable

`@Immutable`보다 약한 약속이다.
적용 대상에 따라 의미가 달라진다.

**타입에 적용하는 경우**

타입이 mutable이지만 안정적이라는 표시다.
완전히 불변은 아니지만 `@StableMarker`의 요구사항은 만족한다는 의미다.

다시 한번 정리하면 `@StableMarker`의 요구사항: <br/>
equals 일관성, 프로퍼티 변경 시 composition에 알림, 모든 public 프로퍼티가 안정적.

**함수나 프로퍼티에 적용하는 경우**

같은 입력에 대해 항상 같은 결과를 반환한다는 약속이다.
이는 함수의 파라미터가 모두 안정적인 타입이거나 primitive 타입일 때만 가능하다.

**언제 사용하나?**

대표적인 예시는 public API는 불변처럼 보이지만 내부는 mutable인 경우다.

예를 들어 private한 mutable 상태를 가지고 있지만, 
public으로 노출되는 API는 불변적으로 동작하거나 `MutableState`로 내부 프로퍼티를 구현했지만, 
외부에서는 읽기 전용으로만 노출되는 경우

**최적화 효과**

Composable 함수의 모든 파라미터가 안정적인 타입이면,
Compose는 위치 기억법을 사용해서 이전 호출과 파라미터를 비교한다.
모든 값이 동일하면 recomposition을 생략한다.

**주의사항**

이 어노테이션은 컴파일러와의 약속이다.
요구사항을 만족하지 않는데 어노테이션을 달면 런타임 오류가 발생할 수 있다.

확신이 없다면 사용하지 않는 것이 좋다.
대부분의 경우 컴파일러가 자동으로 안정성을 추론하므로 어노테이션 없이도 잘 동작한다.

**@Immutable과의 차이**

현재 Compose Compiler는 `@Immutable`과 `@Stable`을 동일하게 취급한다.
둘 다 스마트 recomposition과 Skip 최적화를 동일하게 활성화한다.

그럼에도 두 어노테이션이 따로 존재하는 이유는 미래를 위해서다.
각자 다른 의미를 가지므로, 향후 Compose가 발전하면서 다르게 처리될 수 있다.

올바른 어노테이션을 사용하면 미래의 최적화 혜택을 받을 수 있다.

---




![](./cover.png)
