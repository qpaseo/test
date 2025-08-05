# Coil (Coroutine Image Loader)

- **카테고리**: 이미지 로딩 (Image Loading)
- **설명**: Coil은 안드로이드를 위한 이미지 로딩 라이브러리입니다. Kotlin Coroutines(코루틴)을 기반으로 만들어져 현대적인 안드로이드 개발 방식에 최적화되어 있습니다. 빠르고, 가볍고, 사용하기 쉬운 것을 목표로 합니다.

## 핵심 특징

- **코루틴 기반**: 모든 이미지 요청은 코루틴을 통해 처리되므로, 생명주기 관리가 쉽고 비동기 코드를 간결하게 작성할 수 있습니다.
- **성능 최적화**: 메모리 캐싱, 디스크 캐싱, 비트맵 풀링(bitmap pooling), 다운샘플링(downsampling) 등 다양한 최적화 기법이 자동으로 적용됩니다.
- **Jetpack Compose 지원**: Jetpack Compose와 완벽하게 통합되며, `AsyncImage`라는 컴포저블을 통해 이미지를 쉽게 로드할 수 있습니다.
- **다양한 데이터 타입 지원**: `String`(URL), `HttpUrl`, `Uri`, `File`, `Drawable`, `Bitmap` 등 다양한 소스로부터 이미지를 로드할 수 있습니다.
- **이미지 변환**: 이미지를 자르거나(cropping), 원형으로 만들거나, 흐림(blur) 효과를 주는 등 다양한 변환(Transformation)을 지원합니다.

## 기본 사용법 (View 시스템)

1.  **`ImageView`에 이미지 로드**: `load` 확장 함수를 사용하여 한 줄의 코드로 `ImageView`에 이미지를 로드할 수 있습니다.

    ```kotlin
    import coil.load

    val imageView: ImageView = findViewById(R.id.my_image_view)
    val imageUrl = "https://www.example.com/image.jpg"

    imageView.load(imageUrl) {
        crossfade(true) // 부드러운 페이드 인 효과
        placeholder(R.drawable.placeholder) // 로딩 중에 보여줄 이미지
        error(R.drawable.error_image) // 에러 발생 시 보여줄 이미지
        transformations(CircleCropTransformation()) // 원형으로 자르기
    }
    ```

## 기본 사용법 (Jetpack Compose)

1.  **`AsyncImage` 컴포저블 사용**: Jetpack Compose에서는 `AsyncImage` 컴포저블을 사용하여 이미지를 로드합니다.

    ```kotlin
    import coil.compose.AsyncImage

    @Composable
    fun MyImageComponent() {
        val imageUrl = "https://www.example.com/image.jpg"

        AsyncImage(
            model = imageUrl,
            contentDescription = "Translated description of what the image contains",
            placeholder = painterResource(R.drawable.placeholder),
            modifier = Modifier.size(128.dp)
        )
    }
    ```

Coil은 간단한 API 뒤에 강력한 이미지 처리 파이프라인을 숨기고 있어, 개발자가 이미지 로딩과 관련된 복잡한 문제들을 신경 쓰지 않고 핵심 기능 개발에 집중할 수 있도록 도와줍니다.
