# React Summary

## What is React?

React는 사용자 인터페이스(UI)를 구축하기 위한 선언적(declarative), 효율적이며 유연한 JavaScript 라이브러리입니다. "컴포넌트(Component)"라고 불리는 작고 고립된 코드 조각을 사용하여 복잡한 UI를 구성할 수 있도록 해줍니다.

## Core Concepts

1.  **Component-Based Architecture**
    -   UI를 재사용 가능한 독립적인 부분(컴포넌트)으로 나눕니다.
    -   컴포넌트는 상태(state)를 자체적으로 관리하며, 이를 통해 UI 개발이 체계적이고 효율적으로 이루어집니다.
    -   함수형 컴포넌트와 클래스형 컴포넌트가 있지만, 현재는 **Hooks**를 사용하는 함수형 컴포넌트가 주류입니다.

2.  **Declarative UI (선언형 UI)**
    -   애플리케이션의 각 상태에 대해 UI가 어떻게 보일지 간단하게 기술하면, React가 데이터 변경 시 관련된 컴포넌트만 효율적으로 업데이트하고 렌더링합니다.
    -   "어떻게" 그릴지를 명령하는 것이 아니라, "무엇을" 그릴지를 선언하는 방식입니다.

3.  **Virtual DOM (가상 DOM)**
    -   React는 실제 DOM을 직접 조작하는 대신, 메모리에 가상 DOM 표현을 유지합니다.
    -   상태가 변경되면, 새로운 가상 DOM 트리를 생성하고 이전 트리와 비교합니다(이 과정을 "Diffing"이라 함).
    -   변경된 부분만 실제 DOM에 적용하여 불필요한 DOM 조작을 최소화하고 성능을 최적화합니다(이 과정을 "Reconciliation"이라 함).

4.  **JSX (JavaScript XML)**
    -   JavaScript 코드 내에서 UI를 시각적으로 표현할 수 있게 해주는 JavaScript의 확장 문법입니다.
    -   HTML과 유사하지만, JavaScript의 모든 기능을 활용할 수 있습니다.
    -   Babel과 같은 트랜스파일러를 통해 일반 JavaScript 코드로 변환됩니다.

5.  **Props and State**
    -   **Props (Properties)**: 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 읽기 전용(immutable) 값입니다.
    -   **State**: 컴포넌트 내부에서 관리되는 동적인 데이터입니다. `useState` Hook을 통해 관리하며, `state`가 변경되면 컴포넌트가 리렌더링됩니다.

6.  **Hooks**
    -   클래스를 작성하지 않고도 함수형 컴포넌트에서 상태 관리, 생명주기(lifecycle) 등 React의 여러 기능을 사용할 수 있게 해주는 함수들입니다.
    -   주요 Hooks: `useState`, `useEffect`, `useContext`, `useReducer` 등.

## React Ecosystem

-   **Routing**: `react-router-dom`
-   **State Management**: `Redux`, `Zustand`, `Recoil` (React의 `Context API`로도 간단한 상태 관리 가능)
-   **Data Fetching**: `TanStack Query (React Query)`, `SWR`
-   **Styling**: `Styled-components`, `Emotion`, `Tailwind CSS`, `CSS Modules`
-   **Frameworks**: `Next.js` (서버 사이드 렌더링, 정적 사이트 생성 등), `Gatsby` (정적 사이트 생성)

React는 UI 라이브러리로서의 역할에 집중하고, 라우팅이나 전역 상태 관리 등은 생태계의 다양한 라이브러리들과 조합하여 유연하게 구축할 수 있는 것이 특징입니다.
