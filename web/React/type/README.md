# React with TypeScript

TypeScript를 React와 함께 사용하면 정적 타입 검사를 통해 코드의 안정성과 유지보수성을 크게 향상시킬 수 있습니다. 이 문서에서는 React 프로젝트에서 TypeScript를 사용하는 기본적인 방법을 설명합니다.

## 1. 프로젝트 설정

Create React App(CRA)을 사용하여 TypeScript 프로젝트를 쉽게 시작할 수 있습니다.

```bash
npx create-react-app my-app --template typescript
```

## 2. 컴포넌트 Props 타입 정의

컴포넌트가 받는 `props`의 타입을 정의하여 잘못된 `props` 전달을 방지할 수 있습니다.

-   `type` 또는 `interface` 키워드를 사용하여 `props`의 타입을 선언합니다.
-   함수형 컴포넌트의 타입으로 `React.FC` (FunctionComponent)를 사용할 수 있지만, 최근에는 `props` 객체에 직접 타입을 지정하는 방식이 더 선호됩니다.

```tsx
import React from 'react';

// Props 타입 정의
type GreetingProps = {
  name: string;
  messageCount?: number; // '?'는 선택적(optional) prop을 의미
};

// props에 직접 타입 지정
const Greeting = ({ name, messageCount = 0 }: GreetingProps) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {messageCount > 0 && <p>You have {messageCount} new messages.</p>}
    </div>
  );
};

export default Greeting;
```

## 3. State 타입 정의 (`useState`)

`useState` Hook은 제네릭(generic)을 사용하여 상태(state)의 타입을 명시적으로 지정할 수 있습니다. 대부분의 경우 TypeScript가 초기값으로부터 타입을 추론하므로 명시적 타입 지정이 필요 없을 때도 많습니다.

```tsx
import React, { useState } from 'react';

type User = {
  id: number;
  name: string;
};

const UserProfile = () => {
  // 타입 추론: count는 number 타입으로 자동 설정됨
  const [count, setCount] = useState(0);

  // 명시적 타입 지정: user는 User 또는 null 타입이 될 수 있음
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = () => {
    setUser({ id: 1, name: 'John Doe' });
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      
      <button onClick={fetchUser}>Fetch User</button>
      {user && <p>Welcome, {user.name}</p>}
    </div>
  );
};
```

## 4. 이벤트 핸들러 타입 정의

DOM 이벤트 핸들러 함수의 `event` 객체에도 타입을 지정해야 합니다. React는 `SyntheticEvent`를 기반으로 한 다양한 이벤트 타입을 제공합니다.

-   **`React.ChangeEvent<HTMLInputElement>`**: `<input>` 요소의 `onChange` 이벤트
-   **`React.FormEvent<HTMLFormElement>`**: `<form>` 요소의 `onSubmit` 이벤트
-   **`React.MouseEvent<HTMLButtonElement>`**: `<button>` 요소의 `onClick` 이벤트

```tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';

const MyForm = () => {
  const [value, setValue] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert('A name was submitted: ' + value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={value} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};
```

## 5. Hooks 타입 정의

-   **`useRef`**: `useRef`로 생성된 `ref` 객체의 타입을 지정합니다. DOM 요소에 접근할 때는 해당 요소의 타입을 제네릭으로 전달합니다.
-   **`useContext`**: `createContext`로 생성된 `Context`의 타입을 기반으로 타입이 추론됩니다.
-   **`useReducer`**: `state`와 `action`의 타입을 정의하여 리듀서 함수의 타입을 지정합니다.

```tsx
// useRef 예제
const inputRef = useRef<HTMLInputElement>(null);

// useReducer 예제
type State = { count: number };
type Action = { type: 'increment' } | { type: 'decrement' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: throw new Error();
  }
};

const [state, dispatch] = useReducer(reducer, { count: 0 });
```
