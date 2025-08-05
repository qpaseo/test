## 태그 (UI 요소)
코틀린으로 안드로이드 앱을 만들 때, 최신 UI 개발 방식은 **Jetpack Compose**를 사용합니다. 이는 React와 매우 유사한 선언형 UI 프레임워크입니다. XML 기반의 전통적인 방식 대신, 코틀린 함수를 호출하여 UI를 구성합니다.

### 1. Composable 함수
- `@Composable` 어노테이션을 붙인 함수는 UI의 한 조각을 정의합니다.
- 이는 **React의 함수형 컴포넌트**와 거의 동일한 개념입니다.
- Composable 함수는 다른 Composable 함수를 호출하여 더 복잡한 UI 트리를 만들 수 있습니다.

```kotlin
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview

// "Hello, [name]!" 텍스트를 표시하는 Composable 함수
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}

// 개발 환경에서 미리보기를 제공하는 @Preview
@Preview
@Composable
fun DefaultPreview() {
    Greeting("Android")
}
```

### 2. 기본 UI 요소 (태그)
HTML 태그처럼 미리 정의된 Composable 함수를 사용해 UI를 조립합니다.

- `Text`: 텍스트를 화면에 표시합니다. (HTML의 `p` 또는 `span` 태그와 유사)
- `Button`: 클릭 가능한 버튼입니다.
- `TextField`: 사용자 입력을 받는 텍스트 필드입니다. (HTML의 `input` 태그)
- `Image`: 이미지를 표시합니다. (HTML의 `img` 태그)

#### HTML의 `div`처럼 레이아웃을 구성하는 요소들

HTML에서 `<div>`를 사용해 영역을 나누고 CSS로 레이아웃을 잡는 것처럼, Compose에서는 목적에 따라 다양한 레이아웃 Composable을 사용합니다.

- **`Column`**: 자식 요소들을 **세로**로 차례대로 쌓습니다. (CSS `display: flex; flex-direction: column;` 과 유사)
- **`Row`**: 자식 요소들을 **가로**로 나란히 배치합니다. (CSS `display: flex; flex-direction: row;` 과 유사)
- **`Box`**: 자식 요소들을 **겹쳐서** 쌓거나, 특정 위치에 배치할 때 사용합니다. (CSS `position: relative` 컨테이너와 그 안의 `position: absolute` 자식들을 생각하면 쉽습니다.)
- **`Surface`**: UI의 표면을 나타내는 Composable입니다. 배경색, 그림자(elevation), 모양(shape) 등을 지정할 수 있어 시각적인 그룹을 만들 때 유용합니다. 단순한 `div`보다는 스타일이 적용된 `div`에 가깝습니다.
- **`Scaffold`**: 머티리얼 디자인의 기본 구조(상단 앱 바, 하단 바, 플로팅 액션 버튼 등)를 쉽게 구현할 수 있도록 미리 짜인 레이아웃입니다. 화면 전체의 뼈대를 잡을 때 사용합니다.

#### 스타일링을 위한 `Modifier` (CSS와 유사)

이 모든 Composable들을 꾸미고 속성을 부여하는 것이 바로 **`Modifier`** 입니다. `Modifier`는 CSS의 역할과 매우 유사하여, `padding`, `margin`, `size`, `background`, `border` 등 거의 모든 스타일과 이벤트를 적용할 수 있습니다.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun StyledBox() {
    Column(
        modifier = Modifier
            .size(200.dp) // 가로, 세로 200dp
            .background(Color.LightGray) // 배경색
            .padding(16.dp) // 안쪽 여백
    ) {
        Text("이것은 스타일이 적용된 Box입니다.")
    }
}
```

### 3. 레이아웃 구성
Composable을 정렬하기 위해 `Row` (가로), `Column` (세로), `Box` (겹치기) 같은 레이아웃 Composable을 사용합니다. 이는 CSS의 Flexbox와 유사한 개념입니다.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row

@Composable
fun UserProfile(name: String, age: Int) {
    Row {
        // Image(...) // 프로필 사진
        Column {
            Text(text = "이름: $name")
            Text(text = "나이: $age")
        }
    }
}
```

### 4. 상태 관리 (State Management)
React의 `useState`처럼, Composable은 `remember`와 `mutableStateOf`를 사용해 상태를 가질 수 있습니다. 상태가 변경되면 UI가 자동으로 다시 렌더링(Recomposition)됩니다.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember

@Composable
fun Counter() {
    // `remember`는 리컴포지션이 일어나도 상태를 유지시킵니다.
    var count by remember { mutableStateOf(0) }

    Button(onClick = { count++ }) {
        Text("You've clicked me $count times")
    }
}
```
React의 개념과 비교하면 훨씬 쉽게 Jetpack Compose를 이해할 수 있습니다.

---

## 요소 사이에 마진(여백) 주는 방법

Jetpack Compose에서는 '마진'이라는 개념 대신 **`padding`**과 **`Spacer`**를 주로 사용해 여백을 만듭니다.

### 1. `Modifier.padding()` 사용하기

가장 일반적인 방법입니다. 특정 UI 요소(Composable)의 바깥쪽에 여백을 줍니다.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun MarginExample() {
    Column {
        // Text 1: 위, 아래, 좌, 우 모든 방향에 16dp의 여백을 줍니다.
        Text(
            text = "Hello, World!",
            modifier = Modifier.padding(16.dp)
        )

        // Text 2: 위쪽에만 8dp, 시작(왼쪽) 부분에 16dp의 여백을 줍니다.
        Text(
            text = "Jetpack Compose",
            modifier = Modifier.padding(top = 8.dp, start = 16.dp)
        )
    }
}
```

### 2. `Spacer` 사용하기

두 요소 사이에 빈 공간을 만들고 싶을 때 사용합니다. `Spacer`는 보이지 않는 UI 요소로, 공간만 차지합니다.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun SpacerExample() {
    Column {
        Text(text = "첫 번째 텍스트")

        // 두 텍스트 사이에 20dp 높이의 빈 공간을 추가합니다.
        Spacer(modifier = Modifier.height(20.dp))

        Text(text = "두 번째 텍스트")
    }
    // Row(가로 정렬) 안에서는 Spacer(modifier = Modifier.width(20.dp)) 처럼 사용합니다.
}
```

### 3. `Arrangement.spacedBy()` 사용하기

`Column`, `Row` 등 여러 자식 요소를 포함하는 컨테이너에서 모든 자식 요소들 사이에 일정한 간격을 주고 싶을 때 매우 유용합니다.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp

@Composable
fun ArrangementExample() {
    // 모든 자식 요소들 사이에 수직으로 10dp의 간격을 줍니다.
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Text(text = "항목 1")
        Text(text = "항목 2")
        Text(text = "항목 3")
    }
}
```

---

## 요소 겹치기 (Layering)

`Box` Composable을 사용하면 요소들을 겹치게 배치할 수 있습니다. 이는 CSS의 `position: relative`와 `position: absolute`를 사용하는 것과 유사합니다.

### 예시: 배경을 100%로 채우고 중앙에 로고 배치하기

1.  `Box`를 `Modifier.fillMaxSize()`로 화면 전체에 펼칩니다.
2.  `Box`에 `Modifier.background()`로 배경색을 지정합니다.
3.  `Box`의 `contentAlignment` 속성을 `Alignment.Center`로 설정하여 내부의 모든 자식들을 중앙에 배치합니다.
4.  `Box` 내부에 `Image` Composable을 넣어 로고를 표시합니다.

```kotlin
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
// import com.your.package.R // 실제 프로젝트의 R 클래스 경로를 임포트해야 합니다.

@Composable
fun CenteredLogoScreen() {
    // Box는 자식 요소들을 겹치거나 정렬할 때 사용합니다.
    Box(
        modifier = Modifier
            .fillMaxSize() // Modifier를 통해 이 Box가 화면 전체를 100% 채우도록 설정
            .background(Color.White), // 배경색을 흰색으로 설정
        contentAlignment = Alignment.Center // Box 내부의 모든 내용물을 중앙에 정렬
    ) {
        // Image Composable을 사용해 로고를 표시합니다.
        // R.drawable.logo는 'res/drawable' 폴더에 있는 'logo.png' 같은 이미지 파일을 가리킵니다.
        Image(
            painter = painterResource(id = R.drawable.logo),
            contentDescription = "Application Logo" // 접근성을 위한 이미지 설명
        )
    }
}

@Preview(showBackground = true)
@Composable
fun CenteredLogoScreenPreview() {
    CenteredLogoScreen()
}
```