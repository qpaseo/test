# Next.js Page Routing

Next.js의 가장 큰 특징 중 하나는 **파일 시스템 기반 라우팅**입니다. 디렉토리 구조를 사용하여 애플리케이션의 경로를 직관적으로 정의할 수 있습니다.

## App Router (Next.js 13+ 권장)

`app` 디렉토리 내의 폴더 구조를 사용하여 경로를 정의합니다. 각 경로 세그먼트는 폴더로 표현되며, 해당 폴더 안의 `page.tsx` 파일이 해당 경로의 UI가 됩니다.

### 1. 기본 라우팅 (Basic Routing)

-   `app/page.tsx` -> `/`
-   `app/dashboard/page.tsx` -> `/dashboard`
-   `app/dashboard/settings/page.tsx` -> `/dashboard/settings`

### 2. 동적 라우팅 (Dynamic Segments)

폴더 이름을 대괄호 `[]`로 묶어 동적 세그먼트를 생성할 수 있습니다.

-   `app/blog/[slug]/page.tsx` -> `/blog/post-1`, `/blog/another-post`
    -   컴포넌트 내에서 `params.slug`로 값에 접근할 수 있습니다.

### 3. 모든 경로 잡기 (Catch-all Segments)

대괄호 안에 `...`를 추가하여 모든 하위 경로를 포함할 수 있습니다.

-   `app/shop/[...slug]/page.tsx` -> `/shop/a`, `/shop/a/b`, `/shop/a/b/c`
    -   `params.slug`는 `['a']`, `['a', 'b']`, `['a', 'b', 'c']`와 같은 배열이 됩니다.

### 4. 레이아웃 (Layouts)

`layout.tsx` 파일을 사용하여 여러 페이지에서 공유되는 UI를 정의할 수 있습니다.

-   `app/layout.tsx`: 모든 페이지에 적용되는 루트 레이아웃 (e.g., `<html>`, `<body>` 태그 포함)
-   `app/dashboard/layout.tsx`: `/dashboard` 및 그 하위 모든 경로에 적용되는 레이아웃

### 5. 페이지 이동 (`<Link>`)

`next/link` 컴포넌트를 사용하여 클라이언트 사이드 네비게이션을 구현합니다. 페이지를 새로고침하지 않고 부드럽게 전환됩니다.

```tsx
import Link from 'next/link';

function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog/my-post">Blog Post</Link>
    </nav>
  );
}
```

## Pages Router (기존 방식)

`pages` 디렉토리 내의 파일 구조를 사용합니다.

-   `pages/index.js` -> `/`
-   `pages/about.js` -> `/about`
-   `pages/posts/[id].js` -> `/posts/1`, `/posts/2` (동적 라우팅)

App Router와 개념은 유사하지만, `_app.js` (공통 레이아웃), `_document.js` (HTML 뼈대)와 같은 특수한 파일을 사용하며, 데이터 페칭 방식에 차이가 있습니다.
