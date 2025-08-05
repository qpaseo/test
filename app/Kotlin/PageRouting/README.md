## 페이지 라우팅 (Page Routing)
Jetpack Compose에서는 **Navigation Compose** 라이브러리를 사용해 화면(페이지) 간 이동을 관리합니다. 이는 React 애플리케이션에서 `react-router-dom`을 사용하는 방식과 매우 유사합니다.

### 주요 구성 요소
- **`NavController`**: 내비게이션 상태를 관리하고, 화면 이동(`navigate`)이나 뒤로 가기(`popBackStack`) 같은 명령을 수행하는 중앙 컨트롤러입니다.
- **`NavHost`**: 내비게이션 그래프의 컨테이너 역할을 하는 Composable입니다. 현재 `route`에 맞는 Composable을 화면에 렌더링합니다. (React Router의 `<Routes>`와 유사)
- **`composable(route = "...")`**: `NavHost` 내에서 특정 `route`(경로)와 그 경로에 해당하는 Composable 화면을 정의합니다. (React Router의 `<Route path="..." element={...} />`와 유사)

### 기본 예시: 홈, 프로필 화면 간 이동

#### 1. Route 정의
앱 내 각 화면의 고유한 경로를 문자열 상수로 정의해두면 편리합니다.

```kotlin
object AppRoutes {
    const val HOME = "home"
    const val PROFILE = "profile"
}
```

#### 2. NavHost 설정 및 화면 연결
앱의 메인 Composable에서 `NavHost`를 설정하고 각 경로에 맞는 화면을 연결합니다.

```kotlin
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = AppRoutes.HOME) {
        composable(route = AppRoutes.HOME) {
            HomeScreen(
                onNavigateToProfile = { navController.navigate(AppRoutes.PROFILE) }
            )
        }
        composable(route = AppRoutes.PROFILE) {
            ProfileScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}
```

---

### 실제 프로젝트에서의 구조: 라우팅 로직 분리하기
앱의 규모가 커지면 모든 라우팅 로직을 `MainActivity` 한 곳에 두는 것은 비효율적입니다. React에서 `routes.js` 파일을 분리하듯, Kotlin에서도 파일을 분리하여 관리하는 것이 좋습니다.

#### 추천 파일 구조
```
app/
└── src/main/java/com/yourpackage/
    ├── navigation/
    │   ├── AppRoutes.kt      // 1. 경로 이름만 관리
    │   └── AppNavigation.kt    // 2. NavHost 및 내비게이션 그래프 전체 설정
    ├── ui/
    │   └── screens/
    │       ├── HomeScreen.kt
    │       └── ProfileScreen.kt
    └── MainActivity.kt         // 3. 최종 진입점 (매우 간결해짐)
```

#### 1. `navigation/AppRoutes.kt`
```kotlin
package com.yourpackage.navigation

// 앱의 모든 화면 경로를 한 곳에서 관리합니다.
object AppRoutes {
    const val HOME = "home"
    const val PROFILE = "profile"
    const val SETTINGS = "settings"
}
```

#### 2. `navigation/AppNavigation.kt`
이 파일이 실질적인 라우터(Router)의 역할을 합니다.
```kotlin
package com.yourpackage.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.yourpackage.ui.screens.HomeScreen
import com.yourpackage.ui.screens.ProfileScreen

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = AppRoutes.HOME) {
        composable(AppRoutes.HOME) {
            HomeScreen(
                onNavigateToProfile = { navController.navigate(AppRoutes.PROFILE) }
            )
        }
        composable(AppRoutes.PROFILE) {
            ProfileScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        // 새로운 화면이 추가되어도 이 파일에서만 수정하면 됩니다.
        // composable(AppRoutes.SETTINGS) { SettingsScreen(...) }
    }
}
```

#### 3. `MainActivity.kt`
`MainActivity`는 이제 내비게이션의 상세 구현을 알 필요 없이, `AppNavigation`을 호출하기만 하면 됩니다.
```kotlin
package com.yourpackage

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.yourpackage.navigation.AppNavigation // 임포트

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            // 앱 테마 안에 AppNavigation을 넣어주면 끝!
            YourAppTheme {
                AppNavigation()
            }
        }
    }
}
```
이 구조는 **가독성, 유지보수성, 확장성**을 크게 향상시키는 표준적인 개발 방식입니다.