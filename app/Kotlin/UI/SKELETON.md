# Skeleton UI (스켈레톤 UI) in Android

스켈레톤 UI는 안드로이드에서도 사용자 경험을 향상시키는 중요한 패턴입니다. 데이터가 로드되는 동안 실제 UI의 레이아웃과 유사한 모양의 플레이스홀더를 보여주어, 사용자가 로딩 상태를 더 자연스럽게 인지하고 지루함을 덜 느끼게 합니다.

## Shimmer for Android 라이브러리

Facebook에서 개발한 `Shimmer`는 안드로이드에서 스켈레톤 UI를 구현할 때 가장 널리 사용되는 라이브러리입니다. 뷰 계층(View hierarchy)에 반짝이는 애니메이션 효과를 추가하여 세련된 스켈레톤 UI를 매우 쉽게 만들 수 있습니다.

### 1. 의존성 추가

`build.gradle.kts` (또는 `build.gradle`) 파일에 Shimmer 라이브러리 의존성을 추가합니다.

```groovy
// build.gradle.kts
implementation("com.facebook.shimmer:shimmer:0.5.0")
```

### 2. XML 레이아웃에서 사용법

`ShimmerFrameLayout`으로 스켈레톤 효과를 적용할 뷰들을 감쌉니다.

-   `app:shimmer_auto_start="true"`: 뷰가 화면에 보일 때 자동으로 애니메이션을 시작합니다.
-   내부에는 실제 UI와 유사한 구조의 플레이스홀더 뷰(보통 배경색만 있는 `View`나 `TextView`)를 배치합니다.

```xml
<!-- res/layout/placeholder_item.xml -->
<com.facebook.shimmer.ShimmerFrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:shimmer_auto_start="true">

    <!-- 실제 UI와 비슷한 모양의 플레이스홀더 레이아웃 -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:padding="16dp">

        <View
            android:layout_width="70dp"
            android:layout_height="70dp"
            android:background="@color/placeholder_bg" />

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginStart="16dp"
            android:orientation="vertical">

            <View
                android:layout_width="match_parent"
                android:layout_height="20dp"
                android:background="@color/placeholder_bg" />

            <View
                android:layout_width="match_parent"
                android:layout_height="20dp"
                android:layout_marginTop="8dp"
                android:background="@color/placeholder_bg" />
        </LinearLayout>
    </LinearLayout>

</com.facebook.shimmer.ShimmerFrameLayout>
```

### 3. 코드에서 제어하기

로딩 상태에 따라 Shimmer 애니메이션을 시작하거나 중지하고, 플레이스홀더의 가시성을 제어합니다.

```kotlin
// MyFragment.kt
val shimmerLayout = view.findViewById<ShimmerFrameLayout>(R.id.shimmer_view_container)
val dataLayout = view.findViewById<LinearLayout>(R.id.data_view_container)

viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
    if (isLoading) {
        shimmerLayout.startShimmer()
        shimmerLayout.visibility = View.VISIBLE
        dataLayout.visibility = View.GONE
    } else {
        shimmerLayout.stopShimmer()
        shimmerLayout.visibility = View.GONE
        dataLayout.visibility = View.VISIBLE
    }
}
```

### Jetpack Compose에서의 구현

Jetpack Compose에서는 `Modifier`를 확장하여 직접 스켈레톤 효과를 만들거나, 관련 라이브러리를 사용할 수 있습니다. Modifier에 그라데이션 배경과 애니메이션을 추가하여 Shimmer와 유사한 효과를 구현하는 것이 일반적입니다.
