# Skeleton UI (스켈레톤 UI) in iOS

iOS에서도 스켈레톤 UI는 로딩 중인 컨텐츠에 대한 기대감을 주고 앱의 인지 성능을 향상시키는 효과적인 방법입니다. SwiftUI와 UIKit에서 각각 스켈레톤 UI를 구현하는 방법을 알아봅니다.

## SwiftUI에서 구현하기

SwiftUI에서는 별도의 라이브러리 없이도 `Shape`, `Modifier`, 애니메이션을 조합하여 스켈레톤 효과를 쉽게 만들 수 있습니다.

### 1. 기본 아이디어

-   실제 컨텐츠의 모양과 크기를 갖는 `Shape`(e.g., `Rectangle`, `Circle`)를 플레이스홀더로 사용합니다.
-   `.redacted(reason: .placeholder)` 수정자를 사용하여 뷰를 스켈레톤 상태로 만듭니다.
-   반짝이는 효과를 위해 그라데이션과 애니메이션을 추가할 수 있습니다.

### 2. 예제 코드: `.redacted` 수정자 사용

SwiftUI 2.0부터 제공되는 `.redacted` 수정자를 사용하면 매우 간단하게 스켈레톤 UI를 구현할 수 있습니다.

```swift
import SwiftUI

struct ContentView: View {
    @State private var isLoading = true

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 16) {
                // Avatar
                Circle()
                    .frame(width: 60, height: 60)

                // User Info
                VStack(alignment: .leading, spacing: 8) {
                    Text("Username")
                        .font(.title)
                    Text("user.email@example.com")
                        .font(.subheadline)
                }
            }
            
            // Post Content
            Text("This is a long paragraph of text that will be loaded later. It represents the content of a post.")
                .font(.body)
                .lineLimit(4)
        }
        .padding()
        .redacted(reason: isLoading ? .placeholder : []) // isLoading이 true일 때 스켈레톤 처리
        .onAppear {
            // 2초 후 로딩 완료
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                isLoading = false
            }
        }
    }
}
```

`redacted`와 함께 `.unredacted()`를 사용하면 스켈레톤 효과가 적용된 뷰 그룹 내에서 특정 뷰만 원래대로 표시할 수도 있습니다.

## UIKit에서 구현하기 (`SkeletonView` 라이브러리)

UIKit 환경에서는 `SkeletonView`라는 인기 있는 라이브러리를 사용하여 스켈레톤 UI를 쉽게 구현할 수 있습니다.

-   **특징**:
    -   `UIView`의 확장을 통해 어떤 뷰든 스켈레톤으로 만들 수 있습니다. (`isSkeletonable = true`)
    -   그라데이션 애니메이션을 쉽게 추가할 수 있습니다.
    -   `UITableView`와 `UICollectionView`를 완벽하게 지원합니다.

### 사용법

1.  뷰에 `isSkeletonable` 속성을 `true`로 설정합니다.
2.  스켈레톤을 보여주고 싶을 때 `view.showAnimatedGradientSkeleton()` 메서드를 호출합니다.
3.  로딩이 완료되면 `view.hideSkeleton()` 메서드를 호출하여 실제 컨텐츠를 표시합니다.
