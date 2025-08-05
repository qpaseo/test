# Kingfisher

- **카테고리**: 이미지 로딩 (Image Loading)
- **설명**: Kingfisher는 Swift로 작성된 강력하고 순수한 이미지 다운로드 및 캐싱 라이브러리입니다. 웹에서 이미지를 다운로드하여 `UIImageView`, `NSImageView`, `Button` 등에 표시하는 작업을 매우 간단하게 만들어줍니다. 내부적으로는 메모리 캐시와 디스크 캐시를 모두 사용하여 성능을 최적화합니다.

## 핵심 특징

- **간단한 사용법**: `kf` 네임스페이스와 확장(extension)을 통해 한 줄의 코드로 이미지 로딩을 시작할 수 있습니다.
- **캐싱**: 메모리 캐시와 디스크 캐시를 모두 지원하여, 한 번 로드한 이미지는 다음부터 빠르게 표시됩니다. 캐시 만료 시간, 용량 등 세부적인 제어가 가능합니다.
- **성능 최적화**: 백그라운드에서 이미지를 다운로드하고 디코딩하여 UI 스레드의 부하를 줄입니다.
- **이미지 처리**: 다운로드된 이미지를 표시하기 전에 리사이징, 라운딩, 필터 적용 등 다양한 전처리(processing) 작업을 수행할 수 있습니다.
- **플레이스홀더 및 인디케이터**: 이미지가 로드되는 동안 플레이스홀더 이미지나 로딩 인디케이터를 쉽게 표시할 수 있습니다.
- **SwiftUI 지원**: `KFImage` 뷰를 제공하여 SwiftUI 환경과 완벽하게 통합됩니다.

## 기본 사용법 (UIKit)

1.  **`UIImageView`에 이미지 로드**: `kf.setImage` 메서드를 사용하여 URL로부터 이미지를 로드하고 표시합니다.

    ```swift
    import Kingfisher
    import UIKit

    class MyViewController: UIViewController {
        @IBOutlet weak var myImageView: UIImageView!

        override func viewDidLoad() {
            super.viewDidLoad()

            let url = URL(string: "https://example.com/image.png")

            myImageView.kf.setImage(
                with: url,
                placeholder: UIImage(named: "placeholder_image"), // 로딩 중 표시할 이미지
                options: [
                    .transition(.fade(0.2)), // 부드러운 페이드 인 효과
                    .processor(DownsamplingImageProcessor(size: myImageView.bounds.size)), // 이미지 리사이징
                    .cacheOriginalImage // 원본 이미지도 캐싱
                ]
            )
        }
    }
    ```

## 기본 사용법 (SwiftUI)

1.  **`KFImage` 뷰 사용**: SwiftUI에서는 `KFImage` 뷰를 사용하여 이미지를 로드합니다.

    ```swift
    import Kingfisher
    import SwiftUI

    struct ContentView: View {
        private let url = URL(string: "https://example.com/image.png")

        var body: some View {
            KFImage(url)
                .placeholder {
                    // 플레이스홀더 뷰
                    ProgressView()
                }
                .resizable() // 이미지 크기 조절 가능
                .fade(duration: 0.25) // 페이드 인 효과
                .onSuccess { result in
                    print("Image loaded: \(result.source.url?.absoluteString ?? "")")
                }
                .onFailure { error in
                    print("Error loading image: \(error.localizedDescription)")
                }
                .frame(width: 200, height: 200)
                .clipShape(Circle()) // 원형으로 자르기
        }
    }
    ```
