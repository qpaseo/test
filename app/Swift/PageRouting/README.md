## 페이지 라우팅 (Page Routing in SwiftUI)
SwiftUI에서는 iOS 16부터 도입된 **`NavigationStack`**을 사용하여 프로그래밍 방식의 화면 이동을 관리합니다. 이는 데이터를 기반으로 화면을 전환하는 현대적이고 타입-안전(Type-safe)한 방법입니다. Kotlin의 Navigation Compose나 React의 React Router와 유사한 목표를 가집니다.

### 주요 구성 요소
- **`NavigationStack`**: 내비게이션 계층을 담는 컨테이너 뷰입니다. 내비게이션 경로에 쌓인 뷰들의 스택을 관리합니다.
- **`NavigationLink(value: ...)`**: 사용자가 탭했을 때 특정 `value`를 내비게이션 스택에 푸시하여 화면 전환을 유발하는 컨트롤입니다. 이 `value`는 내비게이션 목적지를 나타내는 데이터 모델입니다.
- **`.navigationDestination(for:destination:)`**: `NavigationStack`에 적용하는 수정자(Modifier)입니다. 특정 타입의 `value`가 주어졌을 때 어떤 `View`를 보여줄지 정의하는 라우팅 맵 역할을 합니다.

---

### 실제 프로젝트에서의 구조: 라우팅 로직 분리하기
앱 규모가 커질수록 내비게이션 로직을 한 뷰에 모두 넣기보다 별도의 파일로 분리하는 것이 좋습니다.

#### 추천 파일 구조
```
YourApp/
├── Navigation/
│   ├── AppRoute.swift      // 1. 모든 내비게이션 경로를 열거형(enum)으로 정의
│   └── AppCoordinator.swift  // 2. NavigationStack과 라우팅 로직을 관리하는 뷰
├── Screens/
│   ├── HomeScreen.swift
│   └── ProfileScreen.swift
└── YourAppApp.swift          // 3. 최종 진입점
```

#### 1. `Navigation/AppRoute.swift`
내비게이션 가능한 모든 경로를 `Hashable`을 준수하는 열거형으로 정의합니다. 연관값(associated value)을 사용해 파라미터를 타입-안전하게 전달할 수 있습니다.
```swift
import Foundation

// 내비게이션 목적지를 나타내는 타입-안전 열거형
enum AppRoute: Hashable {
    case home
    case profile(userId: String)
    case settings
}
```

#### 2. `Navigation/AppCoordinator.swift`
이 뷰가 실질적인 라우터(Router)의 역할을 하며, 모든 내비게이션 목적지를 정의합니다.
```swift
import SwiftUI

struct AppCoordinator: View {
    var body: some View {
        // NavigationStack이 모든 화면 전환을 관리합니다.
        NavigationStack {
            // 시작 화면을 HomeScreen으로 설정합니다.
            HomeScreen()
                // AppRoute 타입의 경로가 주어지면 어떤 뷰를 보여줄지 여기서 모두 정의합니다.
                .navigationDestination(for: AppRoute.self) { route in
                    switch route {
                    case .home:
                        HomeScreen()
                    case .profile(let userId):
                        ProfileScreen(userId: userId)
                    case .settings:
                        SettingsScreen()
                    }
                }
        }
    }
}
```

#### 각 화면(Screen)의 구현
화면들은 이제 내비게이션의 구체적인 방법을 알 필요 없이, `NavigationLink`에 `AppRoute` 값만 전달하면 됩니다.
```swift
// Screens/HomeScreen.swift
import SwiftUI

struct HomeScreen: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("여기는 홈 화면입니다.")
            
            // "프로필 보기"를 탭하면 .profile(userId:) 값을 스택에 푸시합니다.
            NavigationLink("프로필 보러가기 (user123)", value: AppRoute.profile(userId: "user123"))
            
            NavigationLink("설정으로 가기", value: AppRoute.settings)
        }
        .navigationTitle("홈") // 내비게이션 바 타이틀
    }
}

// Screens/ProfileScreen.swift
import SwiftUI

struct ProfileScreen: View {
    let userId: String

    var body: some View {
        Text("여기는 프로필 화면입니다.\n유저 ID: \(userId)")
            .navigationTitle("프로필")
    }
}
```

#### 3. `YourAppApp.swift`
앱의 메인 진입점은 이제 `AppCoordinator`를 첫 화면으로 설정하기만 하면 됩니다.
```swift
import SwiftUI

@main
struct YourAppApp: App {
    var body: some Scene {
        WindowGroup {
            // 모든 내비게이션 로직을 담고 있는 AppCoordinator를 앱의 루트 뷰로 설정합니다.
            AppCoordinator()
        }
    }
}
```
이 구조는 SwiftUI에서 **타입-안전성**을 보장하면서 **가독성, 유지보수성, 확장성**을 높이는 현대적인 내비게이션 설계 방식입니다.