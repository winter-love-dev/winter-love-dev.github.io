---
insightPostId: test-insight-4
insightPrivate: false
insightTitle: 테스트 인사이트 글입니다
insightDate: '2025-10-17 02:38:05'
insightTags: ['테스트', '개발']
insightThumbnail: 'test.png'
---

![상단 테스트 이미지](./test.png)

안녕하세요! 이것은 테스트용 인사이트 글입니다.

긴 글을 테스트하기 위해 여러 줄을 작성해보겠습니다.

## 코드 블록 테스트

```kotlin
class NetworkMonitor @Inject constructor(
    private val context: Context
) {
    fun observeConnectivity(): Flow<Boolean> = callbackFlow {
        val callback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                trySend(true)
            }
            override fun onLost(network: Network) {
                trySend(false)
            }
        }

        val cm = context.getSystemService<ConnectivityManager>()
        cm?.registerDefaultNetworkCallback(callback)

        awaitClose { cm?.unregisterNetworkCallback(callback) }
    }
}
```

일반 텍스트도 몇 줄 더 추가해봅니다.
이렇게 여러 줄이 있을 때
어떻게 표시되는지 확인할 수 있습니다.

더 많은 컨텐츠를 추가해서
line 계산이 잘 되는지 테스트합니다.

1. 리스트 항목 1
2. 리스트 항목 2
3. 리스트 항목 3

> 인용구도 추가해봅니다.
> 여러 줄 인용구입니다.

![하단 테스트 이미지](./test.png)

마지막 줄입니다!
