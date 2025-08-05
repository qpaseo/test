# Next.js Grammar

Next.js는 React를 기반으로 하므로 React의 모든 문법을 그대로 사용합니다. 이 문서에서는 Next.js에서 추가되거나 중요하게 사용되는 핵심적인 문법과 개념들을 설명합니다.

## 1. App Router vs. Pages Router

Next.js는 두 가지 방식의 라우팅 및 렌더링 모델을 제공합니다.

-   **App Router (Next.js 13+ 권장)**: `app` 디렉토리 기반으로 동작하며, React 서버 컴포넌트(RSC)를 기본으로 사용합니다. 레이아웃, 중첩 라우팅, 로딩 UI, 에러 처리 등을 파일 시스템에서 직관적으로 관리할 수 있습니다.
-   **Pages Router (기존 방식)**: `pages` 디렉토리 기반으로 동작하며, 각 파일이 하나의 라우트가 됩니다. `getServerSideProps`, `getStaticProps`와 같은 데이터 페칭 함수를 사용합니다.

## 2. 서버 컴포넌트 (Server Components) vs. 클라이언트 컴포넌트 (Client Components)

App Router의 핵심 개념으로, 컴포넌트가 어디서 렌더링될지를 결정합니다.

-   **서버 컴포넌트 (기본값)**:
    -   서버에서만 렌더링됩니다. JavaScript 번들이 클라이언트로 전송되지 않아 초기 로딩 성능이 뛰어납니다.
    -   서버 자원(파일 시스템, 데이터베이스 등)에 직접 접근할 수 있습니다.
    -   `useState`, `useEffect`와 같은 클라이언트 측 Hook은 사용할 수 없습니다.

-   **클라이언트 컴포넌트**:
    -   파일 상단에 `"use client";` 지시어를 명시하여 사용합니다.
    -   기존 React 컴포넌트처럼 클라이언트에서 렌더링되고 동작합니다.
    -   `useState`, `useEffect` 등 모든 Hook을 사용할 수 있으며, 사용자 상호작용(클릭, 입력 등)을 처리합니다.

```tsx
// app/page.tsx (서버 컴포넌트)
async function getData() {
  const res = await fetch('https://api.example.com/...');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <h1>{data.title}</h1>;
}

// app/counter.tsx (클라이언트 컴포넌트)
"use client";

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## 3. 파일 시스템 기반 라우팅 (File-system based Routing)

디렉토리와 파일 구조가 그대로 웹 애플리케이션의 URL 경로가 됩니다.

-   `app/page.tsx` -> `/`
-   `app/about/page.tsx` -> `/about`
-   `app/blog/[slug]/page.tsx` -> `/blog/hello-world` (`slug`는 동적 파라미터)

## 4. 특수 파일 (Special Files)

App Router는 정해진 이름의 특수 파일을 사용하여 UI를 구성합니다.

-   `page.tsx`: 라우트의 고유한 UI를 정의합니다.
-   `layout.tsx`: 여러 페이지에서 공유되는 UI(e.g., 헤더, 푸터)를 정의합니다.
-   `loading.tsx`: 해당 경로의 컨텐츠가 로드되는 동안 보여줄 로딩 UI(e.g., 스켈레톤)를 정의합니다.
-   `error.tsx`: 에러 발생 시 보여줄 UI를 정의합니다.
-   `template.tsx`: `layout.tsx`과 유사하지만, 네비게이션 시 상태를 보존하지 않고 새로 마운트됩니다.
-   `route.ts`: API 엔드포인트를 생성할 때 사용합니다. (e.g., `app/api/users/route.ts`)
