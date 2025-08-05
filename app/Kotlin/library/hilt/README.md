# Hilt

- **카테고리**: 의존성 주입 (Dependency Injection)
- **설명**: Hilt는 안드로이드 앱을 위한 의존성 주입(DI) 라이브러리입니다. Google에서 개발했으며, 인기 있는 DI 프레임워크인 Dagger를 기반으로 하지만, 안드로이드 프레임워크와 긴밀하게 통합되고 보일러플레이트를 크게 줄여 훨씬 쉽게 사용할 수 있도록 설계되었습니다.

## 핵심 특징

- **안드로이드에 최적화**: `Activity`, `Fragment`, `ViewModel` 등 안드로이드의 주요 컴포넌트에 대한 생명주기를 이해하고, 별도의 설정 없이 의존성을 주입할 수 있도록 표준화된 방법을 제공합니다.
- **보일러플레이트 감소**: Dagger에 비해 작성해야 할 코드가 훨씬 적습니다. 대부분의 설정이 어노테이션 기반으로 자동화됩니다.
- **표준화된 컴포넌트**: `@HiltAndroidApp`, `@AndroidEntryPoint`, `@HiltViewModel` 등 미리 정의된 어노테이션을 사용하여 DI를 설정하므로, 프로젝트 전체에서 일관된 DI 구조를 유지할 수 있습니다.
- **테스트 용이성**: 테스트에서 실제 의존성을 가짜(fake) 의존성으로 쉽게 교체할 수 있는 기능을 제공합니다.

## 기본 사용법

1.  **`@HiltAndroidApp` 설정**: `Application` 클래스에 `@HiltAndroidApp` 어노테이션을 추가하여 Hilt 코드 생성을 트리거합니다.

    ```kotlin
    // MyApplication.kt
    import android.app.Application
    import dagger.hilt.android.HiltAndroidApp

    @HiltAndroidApp
    class MyApplication : Application() { ... }
    ```

2.  **`@AndroidEntryPoint` 설정**: 의존성을 주입받을 안드로이드 컴포넌트(Activity, Fragment 등)에 `@AndroidEntryPoint` 어노테이션을 추가합니다.

    ```kotlin
    // MainActivity.kt
    import androidx.appcompat.app.AppCompatActivity
    import dagger.hilt.android.AndroidEntryPoint
    import javax.inject.Inject

    @AndroidEntryPoint
    class MainActivity : AppCompatActivity() {
        @Inject lateinit var analyticsService: AnalyticsService
        // ...
    }
    ```

3.  **`@Inject`로 의존성 주입**: `@Inject` 어노테이션을 사용하여 필드에 의존성을 주입받습니다. Hilt가 해당 타입의 인스턴스를 제공해줍니다.

4.  **`@Module`과 `@Provides`로 의존성 제공 방법 정의**: Hilt가 직접 생성할 수 없는 타입(e.g., 인터페이스, 외부 라이브러리 클래스)에 대해서는 모듈(Module)을 만들어 인스턴스 생성 방법을 알려줘야 합니다.

    ```kotlin
    // AppModule.kt
    import dagger.Module
    import dagger.Provides
    import dagger.hilt.InstallIn
    import dagger.hilt.components.SingletonComponent
    import javax.inject.Singleton

    // Retrofit의 ApiService 인스턴스를 제공하는 모듈
    @Module
    @InstallIn(SingletonComponent::class) // 애플리케이션 전역 스코프
    object AppModule {

        @Provides
        @Singleton // 싱글톤으로 제공
        fun provideApiService(): ApiService {
            return Retrofit.Builder()
                .baseUrl("https://api.example.com/")
                .build()
                .create(ApiService::class.java)
        }
    }
    ```

5.  **`@HiltViewModel`**: `ViewModel`에 의존성을 주입할 때는 `@HiltViewModel` 어노테이션을 사용합니다.

    ```kotlin
    // MyViewModel.kt
    import androidx.lifecycle.ViewModel
    import dagger.hilt.android.lifecycle.HiltViewModel
    import javax.inject.Inject

    @HiltViewModel
    class MyViewModel @Inject constructor(
        private val repository: MyRepository
    ) : ViewModel() {
        // ...
    }
    ```
