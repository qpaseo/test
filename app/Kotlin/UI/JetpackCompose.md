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
