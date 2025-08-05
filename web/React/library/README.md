# React: Official & Built-in Libraries

이 문서는 React에 내장되어 있거나 공식적으로 지원되는 주요 기능 및 API를 설명합니다.

## 1. Context API

-   **설명**: Context는 단계마다 `props`를 통해 데이터를 전달할 필요 없이, 컴포넌트 트리 전체에 데이터를 제공할 수 있는 방법을 제공합니다. "prop drilling" 문제를 해결하기 위한 React의 내장 기능입니다.
-   **주요 API**:
    -   `React.createContext()`: Context 객체를 생성합니다.
    -   `Context.Provider`: 생성된 Context를 하위 컴포넌트들에게 전달하는 역할을 합니다. `value` prop을 통해 전달할 값을 지정합니다.
    -   `useContext()`: `Provider`가 전달한 값을 사용하기 위한 Hook입니다.

-   **용도**: 테마(다크/라이트 모드), 사용자 인증 정보, 언어 설정 등 애플리케이션 전역에서 필요한 상태를 관리하는 데 적합합니다. 복잡한 상태 관리에는 `Zustand`나 `Redux` 같은 전문 라이브러리를 사용하는 것이 더 효율적일 수 있습니다.

## 2. Code-Splitting (`React.lazy` & `Suspense`)

-   **설명**: 코드 분할은 앱을 "지연 로딩(lazy-load)"할 수 있는 작은 청크(chunk) 단위로 분할하여 초기 로딩 성능을 향상시키는 기술입니다.
-   **주요 API**:
    -   `React.lazy()`: 동적 `import()`를 사용하여 컴포넌트를 지연 로딩할 수 있게 해줍니다.
    -   `React.Suspense`: `lazy` 컴포넌트가 로드될 때까지 로딩 화면(e.g., 스피너)과 같은 fallback 컨텐츠를 보여주는 역할을 합니다.

-   **용도**: 라우트(페이지) 단위, 또는 사용자의 특정 상호작용(e.g., 모달 열기) 시에만 로드되어야 하는 무거운 컴포넌트에 사용하여 초기 번들 크기를 줄이고 사용자 경험을 개선합니다.

```jsx
import React, { Suspense, lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <h1>My App</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```
