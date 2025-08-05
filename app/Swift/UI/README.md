## 태그 (UI 요소)
Swift로 iOS 앱을 만들 때, 최신 UI 개발 방식은 **SwiftUI**를 사용합니다. 이는 React, Jetpack Compose와 동일한 선언형 UI 프레임워크입니다. 코드를 통해 UI의 구조와 상태를 정의하면, 프레임워크가 알아서 화면을 렌더링하고 업데이트합니다.

### 1. View 프로토콜
- SwiftUI에서 UI의 한 조각은 `View` 프로토콜을 따르는 `struct`로 정의됩니다.
- 이는 **React의 함수형 컴포넌트**나 **Jetpack Compose의 Composable 함수**와 완벽하게 동일한 개념입니다.
- 모든 `View`는 `body`라는 계산 프로퍼티를 가지며, 이 `body` 안에 다른 View들을 조합하여 UI를 구성합니다.

```swift
import SwiftUI

// "Hello, [name]!" 텍스트를 표시하는 View
struct GreetingView: View {
    let name: String

    var body: some View {
        Text("Hello, \(name)!")
    }
}

// 개발 환경에서 미리보기를 제공합니다.
struct GreetingView_Previews: PreviewProvider {
    static var previews: some View {
        GreetingView(name: "SwiftUI")
    }
}
```

### 2. 기본 UI 요소 (태그)
HTML 태그처럼 미리 정의된 View들을 사용해 UI를 조립합니다.

- `Text`: 텍스트를 화면에 표시합니다. (HTML의 `p` 또는 `span`)
- `Button`: 클릭 가능한 버튼입니다.
- `TextField` / `SecureField`: 사용자 입력을 받는 텍스트 필드입니다. (HTML의 `input`)
- `Image`: 이미지를 표시합니다. (HTML의 `img`)
- `Toggle`: 켜고 끄는 스위치입니다. (HTML의 `input type="checkbox"`)
- `Slider`: 특정 범위 내의 값을 선택하는 슬라이더입니다.
- `Stepper`: 값을 증가시키거나 감소시키는 컨트롤입니다.
- `Picker`: 여러 옵션 중 하나를 선택하는 컨트롤입니다. (HTML의 `select`)
- `ProgressView`: 작업 진행 상태를 나타내는 로딩 인디케이터입니다.
- `Link`: 웹 링크를 여는 컨트롤입니다. (HTML의 `a`)

#### HTML의 `div`처럼 레이아웃을 구성하는 요소들

HTML에서 `<div>`를 사용해 영역을 나누고 CSS로 레이아웃을 잡는 것처럼, SwiftUI에서는 스택(Stack) 컨테이너를 사용해 View를 정렬합니다.

- **`VStack`**: 자식 View들을 **세로(수직)**로 차례대로 쌓습니다. (CSS `display: flex; flex-direction: column;` / Compose의 `Column`)
- **`HStack`**: 자식 View들을 **가로(수평)**로 나란히 배치합니다. (CSS `display: flex; flex-direction: row;` / Compose의 `Row`)
- **`ZStack`**: 자식 View들을 **겹쳐서** 쌓습니다. (CSS `position: relative`와 `absolute` / Compose의 `Box`)
- **`Form` / `List`**: 데이터 목록이나 설정 화면을 구성할 때 사용하는 컨테이너입니다. 스크롤 기능을 기본적으로 제공합니다.
- **`ScrollView`**: 내용이 화면을 벗어날 때 스크롤할 수 있는 영역을 만듭니다.
- **`NavigationStack`**: 화면 간 이동(네비게이션)을 관리하는 계층 구조를 만듭니다.

#### 스타일링을 위한 Modifiers (CSS와 유사)

SwiftUI에서는 **Modifiers**를 사용하여 View의 모양과 동작을 수정합니다. 이는 Jetpack Compose의 `Modifier`와 거의 동일한 개념이며, CSS 스타일링과 매우 유사합니다. 함수를 체인 형태로 호출하여 적용합니다.

```swift
import SwiftUI

struct StyledTextView: View {
    var body: some View {
        Text("Styled Text")
            .font(.largeTitle) // 글꼴 크기
            .fontWeight(.bold) // 글꼴 두께
            .foregroundColor(.blue) // 글자색
            .padding() // 안쪽 여백
            .background(Color.yellow) // 배경색
            .cornerRadius(10) // 모서리 둥글게
            .shadow(radius: 5) // 그림자 효과
    }
}
```

### 3. 상태 관리 (State Management)
React의 `useState`, Compose의 `remember { mutableStateOf(...) }`처럼, SwiftUI는 `@State` 프로퍼티 래퍼를 사용해 View의 상태를 관리합니다. `@State`로 선언된 프로퍼티의 값이 변경되면, 해당 View의 `body`가 자동으로 다시 계산되어 UI가 업데이트됩니다.

```swift
struct CounterView: View {
    // @State는 View가 자신의 상태를 소유하고 관리하도록 합니다.
    @State private var count = 0

    var body: some View {
        Button(action: {
            self.count += 1
        }) {
            Text("You've clicked me \(count) times")
        }
    }
}
```
React, Jetpack Compose와 SwiftUI는 이름과 문법만 다를 뿐, 선언형 UI와 상태 관리라는 핵심 철학을 공유하기 때문에 하나의 개념을 이해하면 다른 두 가지를 매우 쉽게 배울 수 있습니다.

---

## 뷰 사이에 마진(여백) 주는 방법

SwiftUI에서는 '마진'이라는 속성 대신 **`padding`**과 **`Spacer`**를 사용하여 뷰(View) 사이의 여백을 만듭니다.

### 1. `.padding()` 수정자(Modifier) 사용하기

가장 기본적인 방법입니다. 특정 뷰의 주변에 여백을 추가합니다.

```swift
import SwiftUI

struct MarginExample: View {
    var body: some View {
        VStack(alignment: .leading) {
            // Text 1: 모든 방향에 기본(adaptive) 여백을 추가합니다.
            Text("Hello, World!")
                .padding()
                .background(Color.yellow) // 여백이 적용된 영역을 보기 쉽게 색상 추가

            // Text 2: 위쪽에만 8pt, 양쪽 옆(leading, trailing)에 16pt 여백을 줍니다.
            Text("SwiftUI")
                .padding(.top, 8)
                .padding([.leading, .trailing], 16)
                .background(Color.orange)
        }
    }
}
```

### 2. `Spacer` 사용하기

두 뷰 사이에 유연하거나 고정된 크기의 빈 공간을 만들 때 사용합니다.

```swift
import SwiftUI

struct SpacerExample: View {
    var body: some View {
        VStack {
            Text("첫 번째 텍스트")

            // 두 텍스트 사이에 20pt 높이의 고정된 빈 공간을 추가합니다.
            Spacer()
                .frame(height: 20)

            Text("두 번째 텍스트")

            // Spacer()만 단독으로 쓰면 남은 공간을 모두 차지하여
            // 다른 요소들을 양 끝으로 밀어냅니다.
            Spacer()

            Text("화면 하단에 고정된 텍스트")
        }
        .padding() // 전체 VStack에도 여백을 줄 수 있습니다.
    }
}
```

### 3. `VStack`, `HStack`의 `spacing` 파라미터 사용하기

스택 내의 모든 요소들 사이에 일정한 간격을 적용하고 싶을 때 가장 편리한 방법입니다.

```swift
import SwiftUI

struct SpacingExample: View {
    var body: some View {
        // 모든 자식 요소들 사이에 수직으로 10pt의 간격을 줍니다.
        VStack(alignment: .leading, spacing: 10) {
            Text("항목 1")
            Text("항목 2")
            Text("항목 3")
        }
    }
}
```

---

## 뷰 겹치기 (Layering)

`ZStack`을 사용하면 뷰들을 Z축(깊이) 방향으로 겹겹이 쌓을 수 있습니다. `ZStack`은 기본적으로 자식 뷰들을 중앙에 배치합니다.

### 예시: 배경을 100%로 채우고 중앙에 로고 배치하기

1.  `ZStack`을 사용하여 뷰들을 겹칠 준비를 합니다.
2.  `ZStack`의 가장 아래쪽 레이어에 `Color` 뷰를 넣어 배경색을 지정합니다. `ignoresSafeArea()`를 붙여주면 노치나 하단 바 같은 안전 영역까지 배경색이 채워집니다.
3.  그 위 레이어에 `Image` 뷰를 넣어 로고를 표시합니다. `ZStack`이 알아서 중앙에 배치해줍니다.

```swift
import SwiftUI

struct CenteredLogoView: View {
    var body: some View {
        // ZStack은 뷰들을 Z축(깊이) 방향으로 겹겹이 쌓습니다.
        ZStack {
            // 1. 배경 레이어 (가장 아래에 위치)
            // .ignoresSafeArea()를 통해 안전 영역(노치 등)까지 색상을 채웁니다.
            Color.white
                .ignoresSafeArea()

            // 2. 로고 이미지 레이어 (배경 위에 위치)
            // ZStack은 자식 뷰들을 기본적으로 중앙에 배치합니다.
            Image("logo") // Assets.xcassets에 "logo"라는 이름으로 추가된 이미지를 참조합니다.
                .resizable() // 이미지 크기를 조절할 수 있도록 설정
                .scaledToFit() // 원본 비율을 유지하면서 프레임에 맞게 조절
                .frame(width: 200) // 예시: 로고의 너비를 200pt로 지정
        }
    }
}

struct CenteredLogoView_Previews: PreviewProvider {
    static var previews: some View {
        CenteredLogoView()
    }
}
```