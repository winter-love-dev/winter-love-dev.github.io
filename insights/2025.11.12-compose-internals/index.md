---
insightPostId: compose-internals
insightPrivate: false
insightTitle: 아침 잠이 덜 깨서 비몽사몽 하지만 뭐라도 짧게 글을 쓰다가 정신 차리는 이야기
insightDate: '2025-11-12 00:10:00'
insightTags: ['Android', 'JetpackComposeInternals']
insightThumbnail: 'cover.png'
---

의식의 흐름대로 글을 마구 휘갈겼더니 나는 어느새 Jetpack Compose Internals 서적 완독 목표를 세워버렸다. "올해 안에" 
하필 요즘같이 바쁜 시기에 이런 생각을 떠올린거니. 
워낙 오래 미뤄왔던 일중 하나를 청산할 기회인데 뭐 좋게좋게 생각하고 이 계획을 확정하기로 했다.

Jetpack Compose UI 프레임워크의 내부 동작 원리를 깊이 있게 다루는 기술 서적이다.
안드로이드 개발 커뮤니티의 유명 개발자 [Jorge Castillo (Linkedin)](https://www.linkedin.com/in/jorgecastillopr/) 가 집필했다.
한국 안드로이드 개발 커뮤니티를 이끌고 있는 멤버인 [Jaewoong Eum (Linkedin)](https://www.linkedin.com/in/skydoves/), [Kimin Ryu (Linkedin)](https://www.linkedin.com/in/kimin-ryu/) 님이 읽기 쉽게 한글 번역을 해주셨다.

이 책을 읽고 이해한 내용들을 원문보다 살짝 더 쉽게 설명하는걸 목표로 삼았다.
얼마나 쉽게 설명할거냐면, 대학생이나 현업 개발자가 컴포즈 다룰줄은 아는데 
좀 더 깊이 있게 파고들고 싶은 자가 받아들일 수 있을 정도면 적당하지 않을까 싶다.
미래의 내가 잊었던 내용을 빠르게 복기하기 위한 정보성 기록으로도 유용하게 작용되길 바란다.

책의 내용은 총 7장까지 있으니 이 구성에 맞춰서 앞으로 7번 정도의 시리즈 글을 생각하고 있다. 
쓰다보면 구성이 길어지거나 짧아질수도.

올해 1분기 쯤 출장으로 이동중인 비행기 내부가 너무 지루해서 이 책을 읽었었다.
가만히 앉아있기는 지루했지만 비행 소음은 이 책에 집중할 수 있게 도와주는 일종의 화이트 노이즈 역할을 했던 기억이 난다.
초반 파트를 바짝 읽고 그 뒤로 몇 달 째 방치중인 현 상태를 반성하며, 미뤄온 일을 하루하루 청산해보겠다.

![](./cover.png)
