## 총정리 (Summary)
이 문서는 코틀린을 사용한 네이티브 앱 개발의 핵심 개념들을 React/NestJS 개발자의 관점에서 정리했습니다.

- **언어 (코틀린 문법)**: 코틀린은 JavaScript와 다른 정적 타입 언어이지만, `val`/`var`, 람다, 문자열 템플릿 등 모던 프로그래밍 언어의 특징을 공유하여 익숙하게 접근할 수 있습니다. 특히 **Null 안전성**은 컴파일 시점에 오류를 잡아주어 JavaScript 개발 시 겪을 수 있는 `undefined is not a function` 같은 런타임 오류를 크게 줄여줍니다.

- **UI (태그/UI 요소)**: **Jetpack Compose**는 React의 패러다임을 그대로 가져왔다고 봐도 무방합니다.
    - `@Composable` 함수 = React 함수형 컴포넌트
    - `remember { mutableStateOf(...) }` = `useState()` 훅
    - 상태(State)가 변경되면 UI가 자동으로 업데이트되는 선언형 방식
    - React 컴포넌트를 만들던 경험을 거의 그대로 적용하여 UI를 개발할 수 있습니다.

- **서버 통신**: **Retrofit**은 타입스크립트와 함께 API 클라이언트를 만드는 것과 유사한 경험을 제공합니다.
    - `interface`에 API 명세를 정의하는 방식은 코드 자동완성과 타입 체크의 이점을 극대화합니다.
    - **코루틴**은 `async/await`를 사용하던 것처럼 비동기 코드를 순차적으로 깔끔하게 작성할 수 있게 해줍니다.
    - `data class`는 서버의 JSON 응답을 담는 DTO(Data Transfer Object) 역할을 합니다.

- **페이지 라우팅**: **Navigation Compose**는 `react-router-dom`과 매우 흡사합니다.
    - `NavHost`와 `composable`을 사용해 경로 기반으로 화면을 구성하는 방식은 웹 개발자에게 매우 친숙합니다.
    - 경로에 파라미터를 넘겨 데이터를 전달하는 방식 또한 동일한 개념입니다.

결론적으로, React와 NestJS 경험은 코틀린과 Jetpack Compose를 사용한 모바일 앱 개발에 매우 강력한 기반이 됩니다. 많은 핵심 개념과 아키텍처 패턴이 서로 닮아있어, 새로운 플랫폼에 훨씬 빠르게 적응하고 생산적으로 개발할 수 있을 것입니다.
