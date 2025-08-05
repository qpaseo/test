# React Page Routing

React는 단일 페이지 애플리케이션(SPA, Single Page Application) 라이브러리이므로 자체적으로 라우팅 기능을 내장하고 있지 않습니다. 페이지 간의 이동(라우팅)을 구현하기 위해서는 별도의 라이브러리를 사용해야 합니다.

## React Router

`react-router-dom`은 React 애플리케이션에서 가장 널리 사용되는 라우팅 라이브러리입니다. 웹 환경에 특화된 DOM 바인딩을 제공합니다.

### 주요 컴포넌트 및 개념

1.  **`<BrowserRouter>`**: HTML5 History API를 사용하여 UI와 URL을 동기화하는 라우터입니다. 애플리케이션의 최상단에 위치해야 합니다.

2.  **`<Routes>`**: 여러 `<Route>` 컴포넌트를 감싸는 컨테이너입니다. 현재 URL과 일치하는 첫 번째 `<Route>`를 렌더링합니다.

3.  **`<Route>`**: 특정 경로(`path`)에 어떤 컴포넌트(`element`)를 렌더링할지 정의합니다.

4.  **`<Link>`**: 페이지를 새로고침하지 않고 다른 경로로 이동할 수 있게 해주는 컴포넌트입니다. HTML의 `<a>` 태그로 렌더링됩니다.

5.  **`useNavigate`**: 프로그래밍 방식으로 라우팅을 제어할 수 있게 해주는 Hook입니다. 예를 들어, 폼 제출 후 특정 페이지로 이동시킬 때 사용합니다.

6.  **`useParams`**: URL의 동적 파라미터(e.g., `/users/:id`) 값을 가져오는 Hook입니다.

### 기본 사용 예제

```jsx
// index.js 또는 App.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

### 동적 라우팅 (Dynamic Routing)

URL 경로에 변수를 사용하여 동적인 페이지를 생성할 수 있습니다.

```jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { userId } = useParams(); // URL에서 userId 파라미터를 가져옴
  return <h2>User Profile: {userId}</h2>;
}

// <Route path="/users/:userId" element={<UserProfile />} />
```

## 기타 라우팅 라이브러리

-   **Next.js Router**: Next.js 프레임워크에 내장된 라우터로, 파일 시스템 기반의 라우팅을 제공하여 매우 직관적입니다.
-   **TanStack Router (구 React Location)**: 타입스크립트를 완벽하게 지원하며, 검색 파라미터(search params) 관리 등 강력한 기능을 제공하는 최신 라우터입니다.
