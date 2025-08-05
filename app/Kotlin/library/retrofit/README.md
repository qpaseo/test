# Retrofit

- **카테고리**: 네트워킹 (Networking)
- **설명**: 안드로이드 및 Java를 위한 타입-세이프(type-safe) HTTP 클라이언트 라이브러리입니다. Square에서 개발했으며, 안드로이드 앱 개발에서 네트워크 통신을 구현할 때 사실상의 표준처럼 사용됩니다. 인터페이스(interface)에 어노테이션을 사용하여 HTTP 요청을 정의하면, Retrofit이 해당 인터페이스의 구현체를 동적으로 생성해줍니다.

## 핵심 특징

- **선언적 API 정의**: 인터페이스와 어노테이션을 사용하여 REST API를 깔끔하게 정의할 수 있습니다.
- **타입 안정성**: 컴파일 시점에 API 명세의 오류를 잡을 수 있습니다.
- **Converter 통합**: `Gson`, `Moshi`, `Jackson` 등 다양한 라이브러리를 컨버터(Converter)로 사용하여 HTTP 응답 본문(JSON, XML 등)을 데이터 클래스(DTO)로 쉽게 파싱할 수 있습니다.
- **코루틴 지원**: `suspend` 함수를 지원하여 코루틴과 완벽하게 통합됩니다. 비동기 네트워크 요청을 매우 간결하게 작성할 수 있습니다.
- **Call Adapter**: `RxJava`나 `Flow` 등 다른 비동기 라이브러리와 통합할 수 있는 확장 포인트를 제공합니다.

## 기본 사용법

1.  **API 인터페이스 정의**: `@GET`, `@POST` 등의 어노테이션을 사용하여 API 엔드포인트를 정의합니다.

    ```kotlin
    // ApiService.kt
    import retrofit2.http.GET
    import retrofit2.http.Path

    data class User(val id: Int, val name: String, val email: String)

    interface ApiService {
        @GET("users/{id}")
        suspend fun getUser(@Path("id") userId: Int): User // suspend 함수로 정의
    }
    ```

2.  **Retrofit 인스턴스 생성**: `Retrofit.Builder`를 사용하여 Retrofit 객체를 생성합니다. 일반적으로 앱 전체에서 싱글톤으로 관리합니다.

    ```kotlin
    // NetworkModule.kt
    import retrofit2.Retrofit
    import retrofit2.converter.gson.GsonConverterFactory

    object NetworkModule {
        private val retrofit = Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .addConverterFactory(GsonConverterFactory.create()) // JSON <-> DTO 변환
            .build()

        val apiService: ApiService = retrofit.create(ApiService::class.java)
    }
    ```

3.  **API 호출**: 생성된 서비스 구현체를 사용하여 API를 호출합니다. 코루틴 스코프 내에서 `suspend` 함수를 직접 호출할 수 있습니다.

    ```kotlin
    // UserRepository.kt
    import kotlinx.coroutines.Dispatchers
    import kotlinx.coroutines.withContext

    class UserRepository {
        private val apiService = NetworkModule.apiService

        suspend fun fetchUser(userId: Int): User {
            return withContext(Dispatchers.IO) { // IO 스레드에서 네트워크 작업 수행
                apiService.getUser(userId)
            }
        }
    }
    ```
