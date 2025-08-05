# React Grammar

이 문서에서는 React의 핵심 문법과 개념을 설명합니다.

## 1. JSX (JavaScript XML)

JSX는 JavaScript를 확장한 문법으로, UI가 어떻게 생겨야 하는지를 설명하기 위해 React와 함께 사용됩니다. XML과 유사한 구문을 사용하여 JavaScript 코드 내에서 UI 구조를 시각적으로 표현할 수 있습니다.

-   **표현식 포함:** 중괄호 `{}`를 사용하여 JavaScript 표현식을 JSX 내에 포함할 수 있습니다.
-   **HTML과 유사:** HTML과 매우 유사하지만, `class` 대신 `className`을 사용하고 `for` 대신 `htmlFor`를 사용하는 등 몇 가지 차이점이 있습니다.
-   **단일 루트 요소:** 컴포넌트가 반환하는 JSX는 반드시 단일 루트 요소로 감싸여야 합니다. `<React.Fragment>` 또는 단축 문법 `<>`를 사용할 수 있습니다.

```jsx
const name = 'React';
const element = <h1>Hello, {name}</h1>;

function App() {
  return (
    <div>
      <h1>Welcome!</h1>
      <p>This is a React component.</p>
    </div>
  );
}
```

## 2. Components

컴포넌트는 UI를 독립적이고 재사용 가능한 부분으로 나눈 것입니다. 개념적으로 JavaScript 함수와 유사하며, "props"라는 입력을 받아 화면에 표시할 React 엘리먼트를 반환합니다.

-   **함수형 컴포넌트 (Functional Components):** 현재 React에서 권장되는 방식으로, JavaScript 함수로 작성됩니다.
-   **클래스형 컴포넌트 (Class Components):** `React.Component`를 상속받는 ES6 클래스로 작성됩니다.

```jsx
// 함수형 컴포넌트
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 클래스형 컴포넌트
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

## 3. Props (Properties)

`props`는 컴포넌트에 전달되는 읽기 전용 데이터입니다. 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 데 사용됩니다.

-   **데이터 전달:** HTML 속성처럼 JSX 태그에 `props`를 전달할 수 있습니다.
-   **읽기 전용:** 자식 컴포넌트는 `props`를 직접 수정할 수 없습니다. 모든 React 컴포넌트는 자신의 `props`를 기준으로 순수 함수처럼 동작해야 합니다.

```jsx
function App() {
  return <Welcome name="Sara" />;
}

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>; // "Hello, Sara"
}
```

## 4. State

`state`는 컴포넌트의 내부 상태를 관리하는 객체입니다. 컴포넌트의 `state`가 변경되면, React는 해당 컴포넌트를 다시 렌더링하여 UI를 업데이트합니다.

-   **`useState` Hook:** 함수형 컴포넌트에서 `state`를 사용하기 위한 Hook입니다.
-   **상태 업데이트:** `state`는 직접 수정해서는 안 되며, `useState`가 반환하는 `setter` 함수를 사용해야 합니다.

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
