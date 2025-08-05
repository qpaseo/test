# 보편적인 앱 프로젝트 구조 (Android & iOS)

이 문서는 Android Studio와 Xcode에서 새로운 앱 프로젝트를 생성할 때 만들어지는 보편적인 디렉토리 구조를 설명합니다.

---

## 1. Xcode (Swift) 프로젝트 구조

- **특징**: Xcode는 파일 시스템과 별개로 그룹(노란색 폴더 아이콘)을 통해 파일을 관리할 수 있지만, 보통 실제 디렉토리 구조와 일치시키는 것이 좋습니다. SwiftUI 프로젝트 기준의 현대적인 구조입니다.

```
MySwiftApp/
├── MySwiftApp.xcodeproj       # Xcode 프로젝트 파일. 빌드 설정, 파일 구조 등 모든 정보를 포함
├── MySwiftApp/                # 실제 소스 코드와 리소스가 담긴 그룹(및 폴더)
│   ├── Application/           # 앱의 생명주기와 관련된 파일
│   │   ├── MySwiftAppApp.swift # @main 속성을 가진 앱의 진입점
│   │   ├── Assets.xcassets   # 이미지, 색상, 아이콘 등 에셋을 관리하는 곳
│   │   └── Preview Content/  # Xcode Preview 기능에서 사용할 에셋
│   ├── Features/              # 기능별로 코드를 그룹화 (MVVM 패턴 등과 함께 사용)
│   │   ├── Login/             # 예: 로그인 기능
│   │   │   ├── LoginView.swift
│   │   │   └── LoginViewModel.swift
│   │   └── Home/              # 예: 홈 화면 기능
│   │       ├── HomeView.swift
│   │       └── HomeViewModel.swift
│   ├── Core/                  # 여러 기능에서 공통으로 사용하는 코드
│   │   ├── Data/              # Model, API 클라이언트 등
│   │   ├── UI/                # 공통으로 재사용되는 UI 컴포넌트 (CustomButton.swift 등)
│   │   └── Utils/             # 확장(Extension), 헬퍼 함수 등
│   └── Supporting Files/      # 지원 파일 그룹
│       └── Info.plist         # 앱의 메타데이터(버전, 식별자 등)를 담고 있는 프로퍼티 리스트
├── MySwiftAppTests/           # 유닛 테스트 코드
│   └── MySwiftAppTests.swift
└── MySwiftAppUITests/         # UI 테스트 코드
    └── MySwiftAppUITests.swift
```
