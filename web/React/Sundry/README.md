# React Sundry (기타)

이 문서에서는 React의 핵심 개념 외에 알아두면 좋은 여러 가지 중요한 주제들을 다룹니다.

## 1. State Management (상태 관리)

컴포넌트의 `state`가 복잡해지거나 여러 컴포넌트가 동일한 `state`를 공유해야 할 때, `props`만으로는 관리가 어려워집니다. 이를 "prop drilling" 문제라고 하며, 전역 상태 관리 라이브러리를 통해 해결할 수 있습니다.

-   **Context API + `useReducer`**: React에 내장된 기능으로, 간단한 전역 상태 관리에 적합합니다. `Redux`와 유사한 패턴을 구현할 수 있습니다.
-   **Redux**: 가장 오래되고 널리 사용되는 상태 관리 라이브러리입니다. 예측 가능한 상태 컨테이너를 제공하며, 미들웨어(middleware)를 통해 비동기 처리 등 다양한 기능을 확장할 수 있습니다. `Redux Toolkit`을 사용하면 보일러플레이트를 크게 줄일 수 있습니다.
-   **Zustand**: 가볍고 간결한 API를 제공하는 상태 관리 라이브러리입니다. `Redux`에 비해 설정이 매우 간단하며, Hooks 기반으로 동작하여 현대적인 React 개발 방식과 잘 맞습니다.
-   **Recoil**: Facebook(Meta)에서 개발한 상태 관리 라이브러리입니다. 원자(atom)라는 개념을 통해 상태를 분산적으로 관리하여, 불필요한 리렌더링을 최소화하는 데 강점이 있습니다.

## 2. Styling (스타일링)

React 컴포넌트의 스타일을 지정하는 방법은 다양합니다.

-   **CSS Modules**: CSS 파일을 모듈처럼 가져와 사용하는 방식입니다. 클래스 이름이 자동으로 고유하게 만들어져 스타일 충돌을 방지합니다.
-   **CSS-in-JS**: JavaScript 코드 내에서 CSS를 작성하는 방식입니다.
    -   **Styled-components**: 태그된 템플릿 리터럴을 사용하여 스타일이 적용된 컴포넌트를 만듭니다.
    -   **Emotion**: `styled-components`와 유사하지만, CSS prop 등 추가적인 기능을 제공하여 유연성이 높습니다.
-   **Utility-First CSS**: 미리 정의된 유틸리티 클래스를 조합하여 스타일을 적용하는 방식입니다.
    -   **Tailwind CSS**: 가장 인기 있는 유틸리티 우선 CSS 프레임워크로, 매우 빠른 개발 속도와 일관된 디자인 시스템 구축을 가능하게 합니다.

## 3. Component Lifecycle (생명주기)

컴포넌트는 생성(mounting), 업데이트(updating), 소멸(unmounting)의 생명주기를 가집니다. 함수형 컴포넌트에서는 `useEffect` Hook을 사용하여 이러한 생명주기의 특정 시점에 코드를 실행할 수 있습니다.

-   **Mounting**: 컴포넌트가 처음 DOM에 삽입될 때.
    -   `useEffect(() => { ... }, [])`
-   **Updating**: `props`나 `state`가 변경되어 컴포넌트가 리렌더링될 때.
    -   `useEffect(() => { ... }, [dep1, dep2])`
-   **Unmounting**: 컴포넌트가 DOM에서 제거될 때. `useEffect`의 `cleanup` 함수로 처리합니다.
    -   `useEffect(() => { return () => { ... } }, [])`

## 4. Higher-Order Components (HOC)

HOC는 컴포넌트를 인자로 받아 새로운 컴포넌트를 반환하는 함수입니다. 컴포넌트 간에 공통 로직(e.g., 인증, 로깅)을 재사용하기 위한 패턴입니다. Hooks가 등장하면서 사용 빈도가 줄었지만, 여전히 유용한 패턴 중 하나입니다.

## 5. Code Splitting (코드 분할)

`React.lazy`와 `Suspense`를 사용하면 애플리케이션 코드를 여러 개의 작은 번들(chunk)로 나눌 수 있습니다. 사용자가 특정 페이지나 기능에 접근할 때만 해당 코드를 로드하여 초기 로딩 성능을 크게 향상시킬 수 있습니다.

```jsx
import React, { Suspense, lazy } from 'react';

const OtherComponent = lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```
