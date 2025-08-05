## 총정리 (Summary)
이 문서는 Swift와 SwiftUI를 사용한 iOS 앱 개발의 핵심 개념들을 웹(React/NestJS) 및 안드로이드(Kotlin/Compose) 개발자의 관점에서 정리했습니다.

- **언어 (Swift vs Kotlin/JS)**: Swift는 코틀린과 매우 유사한 모던 프로그래밍 언어입니다.
    - `let`/`var` (상수/변수), 옵셔널(Null 안전성), 클로저(람다) 등 많은 개념을 공유합니다.
    - JavaScript 개발자에게는 `let`/`const` 키워드가 동일하여 변수/상수 개념이 매우 친숙합니다.
    - 코틀린과 마찬가지로 **타입 안전성**과 **Null 안전성**을 통해 런타임 오류를 크게 줄여줍니다.

- **UI (SwiftUI vs Compose/React)**: **SwiftUI**는 Jetpack Compose, React와 함께 **선언형 UI**의 3대장이라고 할 수 있습니다.
    - `View` 구조체 = React 함수형 컴포넌트 = `@Composable` 함수
    - `@State` 프로퍼티 래퍼 = `useState()` 훅 = `remember { mutableStateOf(...) }`
    - 세 프레임워크 모두 **상태가 UI를 주도**하는 동일한 철학을 공유하므로, 하나를 깊게 이해하면 나머지는 문법만 익히면 될 정도로 학습 곡선이 가파르게 줄어듭니다.

- **서버 통신 (URLSession vs Retrofit/fetch)**: Swift는 **`URLSession`**과 최신 **`async/await`** 문법을 통해 강력한 내장 네트워킹 기능을 제공합니다.
    - 코틀린의 코루틴 + Retrofit 조합과 유사한 수준의 가독성과 효율성을 보여줍니다.
    - `Codable` 프로토콜은 JSON과 데이터 모델 간의 변환을 자동화하여 NestJS의 DTO나 코틀린의 `data class`와 동일한 역할을 수행합니다.

- **페이지 라우팅 (Navigation vs Compose Navigation/React Router)**: SwiftUI의 **`NavigationView`**와 **`NavigationLink`**는 스택 기반의 간단한 내비게이션을 구현하는 직관적인 방법을 제공합니다.
    - 개념적으로 React Router나 Compose Navigation과 유사하지만, 프로그래밍 방식의 복잡한 라우팅을 위해서는 `NavigationStack` 같은 최신 API나 상태 기반의 내비게이션 구현이 필요합니다.

**결론:**
React, NestJS, Kotlin, Jetpack Compose에 대한 경험은 Swift와 SwiftUI를 배우는 데 엄청난 자산입니다. 핵심 아키텍처와 디자인 패턴이 놀라울 정도로 유사하기 때문에, 이미 알고 있는 지식을 바탕으로 새로운 플랫폼의 문법과 API에만 집중하면 됩니다. 이를 통해 크로스플랫폼(Kotlin Multiplatform)이나 멀티플랫폼(네이티브 앱 동시 개발) 개발자로서의 역량을 빠르게 확장할 수 있을 것입니다.
