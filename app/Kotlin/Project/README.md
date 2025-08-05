# 보편적인 앱 프로젝트 구조 (Android & iOS)

이 문서는 Android Studio와 Xcode에서 새로운 앱 프로젝트를 생성할 때 만들어지는 보편적인 디렉토리 구조를 설명합니다.

---

## 1. Android Studio (Kotlin) 프로젝트 구조

- **기준**: Android Studio의 `Project` 파일 뷰 기준입니다. (기본 `Android` 뷰는 이 구조를 단순화하여 보여줍니다.)
- **특징**: Gradle 기반으로 빌드 시스템이 구성되며, 모듈 단위로 프로젝트가 관리됩니다. `app` 모듈이 일반적으로 메인 애플리케이션 모듈입니다.

```
my-android-app/
├── .gradle/                   # Gradle 빌드 시스템이 사용하는 캐시 및 설정 파일
├── .idea/                     # Android Studio IDE가 사용하는 프로젝트 설정 파일
├── app/                       # 메인 애플리케이션 모듈
│   ├── build/                 # 빌드 결과물(APK, AAB 등)이 생성되는 폴더
│   ├── libs/                  # 로컬 라이브러리 파일(.jar, .aar)을 추가하는 곳
│   ├── src/                   # 소스 코드 및 리소스 파일
│   │   ├── main/              # 메인 소스 셋
│   │   │   ├── java/com/example/myapp/  # Kotlin 및 Java 소스 코드가 위치하는 곳
│   │   │   │   ├── ui/          # Activity, Fragment, ViewModel, Composable 등 UI 관련 클래스
│   │   │   │   ├── data/        # Repository, Model(DTO), DAO, API Service 등 데이터 관련 클래스
│   │   │   │   ├── di/          # Hilt, Dagger 등 의존성 주입 관련 모듈
│   │   │   │   ├── util/        # 유틸리티 및 헬퍼 클래스
│   │   │   │   └── MyApplication.kt  # Application 클래스
│   │   │   ├── res/           # 리소스 파일
│   │   │   │   ├── drawable/  # 이미지, 아이콘, 벡터 드로어블
│   │   │   │   ├── layout/    # XML 레이아웃 파일 (Compose 사용 시 비중 감소)
│   │   │   │   ├── mipmap/    # 앱 아이콘
│   │   │   │   └── values/    # 문자열(strings.xml), 색상(colors.xml), 테마(themes.xml) 등
│   │   │   └── AndroidManifest.xml  # 앱의 핵심 정보(권한, 컴포넌트 등)를 정의하는 파일
│   │   ├── test/              # 로컬 유닛 테스트(JUnit) 코드
│   │   └── androidTest/       # 안드로이드 기기/에뮬레이터에서 실행되는 계측 테스트 코드
│   ├── .gitignore             # Git이 무시할 파일 목록
│   └── build.gradle.kts       # app 모듈의 빌드 스크립트 (의존성 라이브러리 추가 등)
├── gradle/                    # Gradle Wrapper 관련 파일
├── .gitignore                 # 프로젝트 전체에서 Git이 무시할 파일 목록
├── build.gradle.kts           # 프로젝트 최상위 빌드 스크립트
└── settings.gradle.kts        # 프로젝트에 포함될 모듈을 정의하는 파일
```
