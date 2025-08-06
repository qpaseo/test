# Jetpack Compose

Jetpack Compose는 Android 앱의 사용자 인터페이스(UI)를 구축하기 위한 Google의 최신 **선언형(Declarative) UI 툴킷(Toolkit)**입니다. Kotlin 언어를 기반으로 하며, 더 적은 코드로 더 빠르고 강력한 UI를 만들 수 있도록 설계되었습니다.

## 핵심 개념: 선언형 UI

Jetpack Compose는 Swift의 SwiftUI와 마찬가지로 '선언형' 패러다임을 따릅니다.

- **명령형 (Imperative) 방식 (예: Android XML/View)**: 데이터가 변경되면 해당 View를 직접 찾아 "어떻게(How)" UI를 변경할지 코드로 작성해야 합니다. (예: `textView.setText("New Text")`)
- **선언형 (Declarative) 방식 (예: Jetpack Compose)**: UI의 모습("What")을 함수(Composable)로 정의하고, 앱의 상태(State)가 변경되면 Compose가 알아서 UI를 다시 그립니다.

## Jetpack Compose는 라이브러리 툴킷

Jetpack Compose는 Android Jetpack 라이브러리 모음에 속한 **툴킷**입니다. Android 프로젝트에 Gradle 의존성을 추가하여 기능을 활성화합니다.

### 적용 방법

1.  Android Studio에서 새 프로젝트를 생성할 때 **Empty Activity (Compose)** 템플릿을 선택하는 것이 가장 간단합니다.
2.  기존 프로젝트의 경우, `build.gradle` 파일에 Compose 관련 라이브러리 의존성을 추가하고 설정을 변경해야 합니다.

## 간단한 코드 예시

화면에 "Hello, Compose!" 텍스트를 표시하는 코드입니다.

```kotlin
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.sp

// @Composable 어노테이션을 붙여 UI 구성요소를 함수로 정의합니다.
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello, $name!",
        modifier = modifier,
        style = TextStyle(
            color = Color.Blue,
            fontSize = 24.sp
        )
    )
}

// Android Studio에서 미리보기를 제공하는 기능입니다.
@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    Greeting("Compose")
}
```

이처럼 Jetpack Compose는 재사용 가능한 함수(Composable)를 조합하여 UI를 구축하므로, 코드의 모듈성과 테스트 용이성이 향상됩니다.

---

## 주요 Modifier 속성 (상세)

`Modifier`는 Composable의 모양, 동작, 접근성 등을 꾸미기 위한 속성들의 집합입니다. 점(`.`)을 이용해 체인 형태로 조합할 수 있습니다.

### 크기 및 공간 (Size & Spacing)
- `padding()`: 내부 여백을 추가합니다. (전체, 또는 각 방향 지정 가능)
- `size()`: 고정된 가로, 세로 크기를 지정합니다.
- `width()`, `height()`: 가로 또는 세로 크기만 지정합니다.
- `defaultMinSize()`: 최소 크기를 지정하여, 콘텐츠가 없어도 해당 크기를 보장합니다.
- `fillMaxWidth()`, `fillMaxHeight()`, `fillMaxSize()`: 부모가 허용한 최대 너비, 높이, 또는 전체 크기를 채웁니다. (비율 지정 가능, 예: `fillMaxWidth(0.75f)`)
- `wrapContentWidth()`, `wrapContentHeight()`, `wrapContentSize()`: 콘텐츠 크기에 맞게 너비, 높이, 또는 전체 크기를 조절합니다.

### 모양 및 배경 (Shape & Background)
- `background()`: 배경색, 브러시, 모양(Shape)을 지정합니다.
- `border()`: 테두리를 추가합니다. (두께, 색상, 모양 지정 가능)
- `clip()`: Composable을 특정 모양(예: `CircleShape`, `RoundedCornerShape`)으로 잘라냅니다.
- `shadow()`: 그림자 효과를 줍니다. (elevation, 모양, 투명도 등 설정 가능)

### 동작 및 상호작용 (Interaction)
- `clickable()`: 클릭 및 탭 이벤트를 처리합니다.
- `combinedClickable()`: 일반 클릭, 길게 누르기, 더블 클릭을 한 번에 처리합니다.
- `draggable()`: 한 방향(가로 또는 세로)으로 드래그 가능하게 만듭니다.
- `scrollable()`: 스크롤 동작을 제어합니다. (주로 `LazyColumn` 등에서 내부적으로 사용)
- `pointerInput()`: 터치, 포인터 관련 저수준(low-level) 이벤트를 직접 다룰 때 사용합니다.
- `focusable()`: 포커스를 받을 수 있도록 설정합니다. (키보드 입력 등)

### 레이아웃 배치 (Layout)
- `weight()`: `Row`나 `Column` 내에서 자식 요소가 차지하는 공간의 비율을 결정합니다. (부모 의존적)
- `align()`: `Box`, `Row`, `Column` 내에서 자식의 정렬 위치를 지정합니다. (부모 의존적)
- `zIndex()`: `Box`와 같이 겹칠 수 있는 레이아웃 내에서 자식들의 Z축 순서를 지정합니다. (숫자가 높을수록 위에 보임)
- `offset()`: 원래 위치에서 지정된 값(x, y)만큼 뷰를 이동시킵니다.
- `onGloballyPositioned()`: 전역 좌표계에서 Composable의 최종 위치와 크기를 얻어올 때 사용합니다.

### 그래픽 및 그리기 (Graphics & Drawing)
- `alpha()`: Composable과 그 자식들의 투명도를 조절합니다.
- `graphicsLayer()`: 투명도(`alpha`), 회전(`rotationX/Y/Z`), 크기(`scaleX/Y`), 그림자(`shadowElevation`) 등 저수준 그래픽 속성을 효율적으로 변경합니다. 애니메이션에 유용합니다.
- `drawBehind()`: Composable의 콘텐츠가 그려지기 **전(뒤)**에 `DrawScope`를 이용해 직접 그립니다.
- `drawWithContent()`: 콘텐츠를 포함하여 그리기 과정을 직접 제어합니다. 콘텐츠를 먼저 그리거나 나중에 그릴 수 있습니다.
- `drawWithCache()`: 그리기 객체들을 캐싱하여 리컴포지션 시 성능을 최적화할 때 사용합니다.

### 의미 정보 (Semantics)
- `semantics()`: 접근성(Accessibility) 서비스나 테스트에서 사용할 UI 요소의 의미 정보를 추가하거나 병합합니다. (예: `contentDescription`)

---

## 공식 문서

- **공식 사이트:** [https://developer.android.com/jetpack/compose](https://developer.android.com/jetpack/compose)
- **Modifier 목록:** [https://developer.android.com/jetpack/compose/modifiers-list](https://developer.android.com/jetpack/compose/modifiers-list)