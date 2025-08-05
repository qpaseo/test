## 서버 통신 (Server Communication)
코틀린/안드로이드 앱에서 서버와 통신할 때는 주로 **Retrofit** 라이브러리를 사용합니다. NestJS에서 컨트롤러와 서비스, DTO를 만들어 API를 정의하는 것처럼, Retrofit도 비슷한 구조로 API를 선언하고 사용합니다. 비동기 처리는 **코루틴(Coroutines)**을 사용하는 것이 표준입니다.

전체적인 흐름은 다음과 같습니다:
1.  **라이브러리 추가**: `build.gradle.kts` 파일에 Retrofit, OkHttp, 그리고 JSON 컨버터(Gson 또는 Moshi) 의존성을 추가합니다.
2.  **DTO 정의**: 서버 응답 JSON을 담을 `data class`를 정의합니다. (NestJS의 DTO와 동일한 역할)
3.  **API 인터페이스 정의**: 호출할 API 엔드포인트를 코틀린 `interface`로 정의합니다.
4.  **Retrofit 클라이언트 생성**: 기본 URL과 컨버터를 설정하여 Retrofit 인스턴스를 만듭니다.
5.  **API 호출**: 코루틴을 사용해 비동기적으로 API를 호출하고 결과를 처리합니다.

### 예시: 사용자 목록 가져오기

#### 1. DTO (Data Transfer Object)
서버가 `[{"id": 1, "name": "홍길동"}, ...]` 형태의 JSON 배열을 반환한다고 가정합니다.

```kotlin
// User.kt
data class User(
    val id: Int,
    val name: String,
    val email: String
)
```

#### 2. API 서비스 인터페이스
NestJS의 `@Get()`, `@Post()` 데코레이터처럼, Retrofit은 어노테이션을 사용해 HTTP 요청을 정의합니다.

```kotlin
// ApiService.kt
import retrofit2.http.GET
import retrofit2.Response

interface ApiService {
    @GET("users") // "https://api.example.com/users"
    suspend fun getUsers(): Response<List<User>>
}
```
- `@GET("users")`: HTTP GET 요청을 보낼 엔드포인트를 지정합니다.
- `suspend`: 이 함수가 코루틴 내에서 실행되어야 하는 비동기 함수임을 나타냅니다. `async/await`과 유사합니다.
- `Response<T>`: HTTP 응답 전체(상태 코드, 헤더 등)를 포함하는 객체입니다.

#### 3. Retrofit 클라이언트 생성
앱이 시작될 때 한 번만 생성하여 재사용하는 것이 일반적입니다.

```kotlin
// RetrofitClient.kt
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    private const val BASE_URL = "https://api.example.com/"

    val instance: ApiService by lazy {
        val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        retrofit.create(ApiService::class.java)
    }
}
```

#### 4. API 호출 (ViewModel에서)
UI 로직을 담당하는 `ViewModel`에서 코루틴을 사용해 API를 호출합니다.

```kotlin
// UserViewModel.kt
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class UserViewModel : ViewModel() {
    fun fetchUsers() {
        // viewModelScope: ViewModel이 활성 상태일 때만 동작하는 코루틴 스코프
        viewModelScope.launch {
            try {
                val response = RetrofitClient.instance.getUsers()
                if (response.isSuccessful) {
                    val users = response.body()
                    // users 리스트를 UI에 표시하기 위한 로직 (State 업데이트 등)
                    println(users)
                } else {
                    // 에러 처리
                    println("Error: ${response.code()}")
                }
            } catch (e: Exception) {
                // 네트워크 예외 처리
                println("Exception: ${e.message}")
            }
        }
    }
}
```
이처럼 Retrofit은 API 명세를 코드로 깔끔하게 관리할 수 있게 해주며, 코루틴과 함께 사용하면 비동기 코드를 간결하게 작성할 수 있습니다.
