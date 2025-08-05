# SwiftUI

SwiftUI는 Apple의 모든 플랫폼(iOS, macOS, watchOS, tvOS)에서 사용자 인터페이스(UI)를 구축하기 위한 현대적인 **선언형(Declarative) UI 프레임워크**입니다. Swift 언어를 사용하여 간결하고 직관적인 코드로 UI를 설계할 수 있습니다.

## 핵심 개념: 선언형 UI

SwiftUI의 가장 큰 특징은 '선언형'이라는 점입니다. 이는 Kotlin의 Jetpack Compose와 동일한 패러다임을 공유합니다.

- **명령형 (Imperative) 방식 (예: UIKit)**: UI 요소의 상태가 변할 때마다 "어떻게(How)" UI를 업데이트할지 코드로 직접 명시합니다. (예: `button.setTitle("New Text", for: .normal)`)
- **선언형 (Declarative) 방식 (예: SwiftUI)**: UI가 어떤 모습("What")이어야 하는지를 데이터 상태(State)에 기반하여 선언합니다. 데이터가 변경되면 SwiftUI가 알아서 UI를 효율적으로 다시 렌더링합니다.

## SwiftUI는 라이브러리가 아닌 프레임워크

SwiftUI는 외부에서 가져오는 라이브러리가 아니라, **Apple의 SDK에 내장된 핵심 프레임워크**입니다. 따라서 별도의 설치 과정 없이 Xcode에서 바로 사용할 수 있습니다.

### 적용 방법

1.  최신 버전의 **Xcode**를 엽니다.
2.  새 프로젝트를 생성할 때 **[Interface]** 옵션으로 **[SwiftUI]**를 선택합니다. (기존 방식은 'Storyboard')
3.  `import SwiftUI` 구문을 사용하여 코드 파일에서 SwiftUI 기능을 가져옵니다.

## 간단한 코드 예시

화면에 "Hello, SwiftUI!" 텍스트를 표시하는 코드입니다.

```swift
import SwiftUI

// View 프로토콜을 따르는 구조체로 UI를 정의합니다.
struct ContentView: View {
    // body 프로퍼티는 화면에 표시될 UI 요소를 반환합니다.
    var body: some View {
        Text("Hello, SwiftUI!")
            .font(.title)
            .foregroundColor(.blue)
    }
}
```

이처럼 SwiftUI는 UI의 구조와 모양을 코드로 명확하게 표현하므로, 가독성이 높고 유지보수가 용이합니다.
