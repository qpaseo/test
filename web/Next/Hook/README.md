# Next.js Hooks

Next.js는 React의 모든 기본 Hook을 지원하며, 라우팅 및 기타 프레임워크 기능과 상호작용하기 위한 자체적인 Hook들을 제공합니다. 이 Hook들은 클라이언트 컴포넌트(`"use client"`) 내에서만 사용할 수 있습니다.

## 1. `useRouter`

`next/navigation` (App Router) 또는 `next/router` (Pages Router)에서 가져옵니다. 프로그래밍 방식으로 페이지를 이동시킬 때 사용됩니다.

-   `router.push('/path')`: 새 경로로 이동합니다. 브라우저 히스토리에 추가됩니다.
-   `router.replace('/path')`: 현재 경로를 대체합니다. 히스토리에 추가되지 않습니다.
-   `router.refresh()`: 현재 경로를 새로고침하여 서버로부터 새로운 데이터를 가져옵니다. (App Router 전용)
-   `router.back()`: 뒤로 가기
-   `router.forward()`: 앞으로 가기

```tsx
"use client";

import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = () => {
    // 로그인 로직 처리 후...
    router.push('/dashboard');
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

## 2. `usePathname`

`next/navigation`에서 가져옵니다. 현재 URL의 경로(pathname) 문자열을 반환합니다. 예를 들어, 현재 URL이 `/dashboard/settings`이면 `"/dashboard/settings"`를 반환합니다.

```tsx
"use client";

import { usePathname } from 'next/navigation';

export default function ActiveLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <a href={href} style={{ color: isActive ? 'blue' : 'black' }}>
      {children}
    </a>
  );
}
```

## 3. `useSearchParams`

`next/navigation`에서 가져옵니다. 현재 URL의 쿼리 파라미터(query parameters)를 읽을 수 있는 읽기 전용 객체를 반환합니다.

```tsx
"use client";

import { useSearchParams } from 'next/navigation';

export default function SearchResult() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q'); // URL: /search?q=hello

  return <p>Searching for: {query}</p>; // "Searching for: hello"
}
```

## 4. `useParams`

`next/navigation`에서 가져옵니다. 현재 경로의 동적 라우트 파라미터(dynamic route parameters)를 포함하는 객체를 반환합니다.

```tsx
// 경로: /blog/[slug]/page.tsx
"use client";

import { useParams } from 'next/navigation';

export default function BlogPost() {
  const params = useParams(); // URL: /blog/my-first-post
  // params는 { slug: 'my-first-post' }

  return <h1>Blog Post: {params.slug}</h1>;
}
```

## Pages Router Hooks

Pages Router를 사용하는 경우 `next/router`에서 Hook을 가져옵니다.

-   **`useRouter`**: `pathname`, `query`, `asPath` 등 라우팅에 대한 모든 정보를 포함하는 라우터 객체를 반환합니다. App Router의 Hook들과 달리 하나의 `useRouter` Hook에 기능이 집중되어 있습니다.
