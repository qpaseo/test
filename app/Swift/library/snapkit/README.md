# SnapKit

- **카테고리**: UI 레이아웃 (UI Layout)
- **설명**: SnapKit은 iOS 및 macOS에서 오토레이아웃(Auto Layout)을 코드로 작성할 때 사용하는 DSL(Domain-Specific Language) 라이브러리입니다. Apple의 기본 NSLayoutConstraint API보다 훨씬 더 간결하고 읽기 쉬운 구문을 제공하여, 코드 기반으로 UI 레이아웃을 잡는 작업을 매우 편리하게 만들어줍니다.

## 핵심 특징

- **간결하고 읽기 쉬운 구문**: `make.edges.equalToSuperview()`와 같이 자연어에 가까운 체인 가능한(chainable) 구문을 사용하여 제약조건(constraints)을 쉽게 설정할 수 있습니다.
- **타입 안정성**: 컴파일 시점에 레이아웃 관련 오류를 확인할 수 있습니다.
- **강력한 기능**: `equalTo`, `lessThanOrEqualTo`, `multipliedBy`, `priority` 등 오토레이아웃의 모든 기능을 지원합니다.
- **디버깅 용이성**: 제약조건에 레이블을 추가하여 디버깅 시 어떤 제약조건인지 쉽게 식별할 수 있습니다.
- **안전한 제약조건 관리**: 기존 제약조건을 쉽게 업데이트하거나 제거할 수 있는 `snp.updateConstraints` 및 `snp.remakeConstraints`와 같은 메서드를 제공합니다.

## 기본 사용법

1.  **뷰 추가 및 제약조건 설정**: `addSubview`로 뷰를 추가한 후, `snp.makeConstraints` 클로저 내에서 제약조건을 설정합니다.

    ```swift
    import SnapKit
    import UIKit

    class MyViewController: UIViewController {
        // 제약조건을 설정할 뷰 생성
        lazy var box = UIView()

        override func viewDidLoad() {
            super.viewDidLoad()

            // 1. 뷰를 뷰 계층에 추가
            self.view.addSubview(box)
            box.backgroundColor = .blue

            // 2. snp.makeConstraints를 사용하여 제약조건 설정
            box.snp.makeConstraints { (make) -> Void in
                // 너비와 높이를 각각 100으로 설정
                make.width.equalTo(100)
                make.height.equalTo(100)

                // 뷰의 중앙을 부모 뷰(superview)의 중앙에 맞춤
                make.center.equalToSuperview()
            }
        }
    }
    ```

2.  **다양한 제약조건 예시**:

    ```swift
    // 가장자리(edges)를 부모 뷰에 맞추고 안쪽으로 10만큼 여백(inset) 주기
    make.edges.equalToSuperview().inset(10)

    // 상단은 부모 뷰의 상단에, 왼쪽과 오른쪽은 각각 부모 뷰의 왼쪽과 오른쪽에 맞춤
    make.top.left.right.equalToSuperview()

    // 다른 뷰(otherView)와의 관계 설정
    // otherView의 상단(top)에서 20만큼 아래(offset)에 나의 상단(top)을 위치시킴
    make.top.equalTo(otherView.snp.bottom).offset(20)

    // 너비를 높이와 같게 설정 (정사각형)
    make.width.equalTo(box.snp.height)
    ```

3.  **제약조건 업데이트**:

    ```swift
    // 기존 제약조건을 변경해야 할 때 사용
    self.box.snp.updateConstraints { (make) in
        make.width.equalTo(200)
    }
    ```

SnapKit을 사용하면 스토리보드나 XIB 파일 없이도 복잡한 UI 레이아웃을 코드로 명확하고 유지보수하기 쉽게 관리할 수 있습니다.
