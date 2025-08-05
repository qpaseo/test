# React Hooks

Hooks는 함수형 컴포넌트에서 React의 state와 생명주기(lifecycle) 기능을 "연결(hook into)"할 수 있게 해주는 함수입니다. Hooks를 통해 클래스형 컴포넌트를 작성할 필요 없이 대부분의 React 기능을 사용할 수 있습니다.

## 기본 Hooks

### 1. `useState`

컴포넌트의 상태(state)를 관리할 수 있게 해주는 Hook입니다.

-   `useState`는 현재 상태 값과 이 값을 업데이트하는 함수, 두 가지를 쌍으로 반환합니다.
-   컴포넌트가 처음 렌더링될 때 초기값 인자를 사용하여 상태를 초기화합니다.

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // 초기값 0
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### 2. `useEffect`

컴포넌트에서 부수 효과(side effects)를 수행할 수 있게 해줍니다. 데이터 가져오기, 구독(subscription) 설정, DOM 조작 등이 부수 효과의 예입니다.

-   `useEffect`는 컴포넌트 렌더링 이후에 특정 코드를 실행하도록 설정합니다.
-   두 번째 인자인 의존성 배열(`deps`)을 통해 부수 효과가 언제 실행될지 제어할 수 있습니다.
    -   배열이 없으면: 매 렌더링마다 실행
    -   빈 배열 `[]`: 마운트될 때 한 번만 실행
    -   배열에 값이 있으면: 해당 값이 변경될 때만 실행

```jsx
import React, { useState, useEffect } from 'react';

function User({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://api.example.com/users/${id}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [id]); // id가 변경될 때만 실행

  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

### 3. `useContext`

컴포넌트 트리 전체에 걸쳐 전역적인(global) 데이터를 공유할 수 있게 해줍니다. `props`를 통해 데이터를 단계별로 전달하는 "prop drilling"을 피할 수 있습니다.

-   `React.createContext`로 생성된 `Context` 객체를 인자로 받습니다.
-   해당 `Context`의 현재 값을 반환합니다.

```jsx
const ThemeContext = React.createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext); // "dark"
  return <div>Current theme: {theme}</div>;
}
```

## 추가 Hooks

-   **`useReducer`**: `useState`의 대안으로, 복잡한 상태 로직을 관리할 때 유용합니다.
-   **`useCallback`**: 특정 함수를 메모이제이션(memoization)하여, 의존성 값이 변경될 때만 함수가 재생성되도록 합니다.
-   **`useMemo`**: 비용이 큰 계산 결과값을 메모이제이션하여, 의존성 값이 변경될 때만 다시 계산하도록 합니다.
-   **`useRef`**: 렌더링과 관련 없는 값을 저장하거나, DOM 요소에 직접 접근할 때 사용합니다.
-   **`useLayoutEffect`**: `useEffect`와 유사하지만, 모든 DOM 변경 후에 동기적으로 실행됩니다. 화면 깜빡임을 방지할 때 유용합니다.
-   **`useImperativeHandle`**: `ref`를 사용할 때 부모 컴포넌트에 노출되는 인스턴스 값을 사용자 정의할 수 있습니다.
-   **`useDebugValue`**: React 개발자 도구에서 사용자 정의 Hook의 레이블을 표시하는 데 사용됩니다.
