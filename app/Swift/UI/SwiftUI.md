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

---

## 주요 View Modifier 속성 (상세)

SwiftUI에서는 `View`에 직접 점(`.`)을 찍어 수정자(Modifier) 메서드를 호출하여 스타일과 동작을 변경합니다.

### 크기 및 공간 (Size & Spacing)
- `.padding()`: 뷰 주위에 내부 여백을 추가합니다. (전체 또는 특정 방향 지정 가능)
- `.frame(width:height:alignment:)`: 뷰의 크기를 제안하거나 고정합니다. `minWidth`, `maxWidth` 등으로 유연한 크기 설정도 가능합니다.
- `.fixedSize(horizontal:vertical:)`: 뷰가 이상적인 크기(콘텐츠 크기)를 유지하도록 강제합니다.
- `.aspectRatio()`: 뷰의 종횡비를 유지합니다.
- `.ignoresSafeArea()`: 안전 영역(Safe Area)을 무시하고 화면 전체를 사용하도록 확장합니다.

### 모양 및 배경 (Shape & Background)
- `.background()`: 배경에 색상, 모양(Shape), 또는 다른 뷰를 추가합니다.
- `.overlay()`: 뷰 위에 다른 뷰를 겹쳐서 올립니다.
- `.border()`: 뷰 주위에 테두리를 추가합니다.
- `.cornerRadius()`: 뷰의 모서리를 둥글게 만듭니다. (iOS 17+ 에서는 `.clipShape(.rect(cornerRadius:))` 권장)
- `.clipShape()`: 뷰를 특정 모양(예: `Circle`, `Capsule`)으로 잘라냅니다.
- `.shadow()`: 그림자 효과를 줍니다. (색상, 반경, 위치 지정 가능)

### 동작 및 상호작용 (Interaction)
- `.onTapGesture { ... }`: 탭 제스처를 감지하여 코드를 실행합니다.
- `.gesture()`: 더 복잡한 제스처(드래그, 길게 누르기, 확대/축소 등)를 추가합니다.
- `.disabled()`: 뷰의 상호작용을 비활성화합니다.
- `.focusable()`: macOS, tvOS 등에서 키보드 포커스를 받을 수 있도록 설정합니다.

### 레이아웃 배치 (Layout)
- `.position()`: 부모 뷰의 좌표 공간 내에서 뷰의 중앙 위치를 절대적으로 지정합니다.
- `.offset()`: 뷰의 원래 위치에서 지정된 값(x, y)만큼 상대적으로 이동시킵니다.
- `.zIndex()`: `ZStack` 내에서 뷰들이 겹칠 때 Z축 순서를 지정합니다. (숫자가 높을수록 위에 보임)
- `.layoutPriority()`: 공간이 부족할 때 어떤 뷰가 우선적으로 공간을 차지할지 결정합니다.

### 그래픽 및 그리기 (Graphics & Drawing)
- `.opacity()`: 뷰의 투명도를 조절합니다. (0.0 ~ 1.0)
- `.rotationEffect()`: 뷰를 지정된 각도만큼 회전시킵니다.
- `.scaleEffect()`: 뷰의 크기를 확대하거나 축소합니다.
- `.blur()`: 뷰에 블러(흐림) 효과를 적용합니다.
- `.drawingGroup()`: 복잡한 뷰를 단일 비트맵으로 렌더링하여 성능을 최적화합니다.

### 의미 정보 (Semantics)
- `.accessibilityLabel()`: VoiceOver 사용자를 위해 뷰에 대한 설명을 추가합니다.
- `.accessibilityHint()`: 뷰와 상호작용했을 때의 결과를 알려주는 힌트를 추가합니다.
- `.accessibilitySortPriority()`: VoiceOver가 뷰를 읽는 순서를 지정합니다.

---

## 공식 문서

- **공식 사이트:** [https://developer.apple.com/xcode/swiftui/](https://developer.apple.com/xcode/swiftui/)
- **Apple 개발자 문서:** [https://developer.apple.com/documentation/swiftui](https://developer.apple.com/documentation/swiftui)