# Next.js Server Communication (Data Fetching)

Next.js는 서버와 클라이언트 환경을 모두 다루기 때문에 데이터 통신(Data Fetching)을 위한 강력하고 다양한 메커니즘을 제공합니다.

## App Router (Next.js 13+ 권장)

App Router에서는 React 서버 컴포넌트(RSC)와 확장된 `fetch` API를 사용하여 데이터를 가져옵니다.

### 1. 서버 컴포넌트 내에서의 `fetch`

서버 컴포넌트는 `async/await`를 직접 사용할 수 있으므로, 데이터 페칭이 매우 간결해집니다. Next.js는 `fetch` API를 확장하여 요청별로 캐싱 및 재검증(revalidating) 전략을 설정할 수 있게 해줍니다.

```tsx
// app/posts/[id]/page.tsx (Server Component)
async function getPost(id) {
  // { cache: 'force-cache' } 가 기본값 (SSG와 유사)
  const res = await fetch(`https://api.example.com/posts/${id}`);
  return res.json();
}

export default async function PostPage({ params }) {
  const post = await getPost(params.id);
  return <h1>{post.title}</h1>;
}
```

### 2. `fetch` 캐싱 옵션

`fetch` 함수의 두 번째 인자로 캐싱 동작을 제어할 수 있습니다.

-   **`cache: 'force-cache'` (기본값)**: `getStaticProps`와 유사. 빌드 시점에 데이터를 가져오고 결과를 캐시합니다.
-   **`cache: 'no-store'`**: `getServerSideProps`와 유사. 매 요청마다 새로운 데이터를 가져옵니다.
-   **`next: { revalidate: 10 }`**: `getStaticProps`의 `revalidate`와 유사 (ISR). 10초 동안은 캐시된 데이터를 사용하고, 10초가 지난 후 요청이 오면 백그라운드에서 데이터를 새로고침합니다.

### 3. 클라이언트 컴포넌트에서의 데이터 페칭

클라이언트 컴포넌트에서는 기존 React 방식과 동일하게 `useEffect`를 사용하거나, **SWR** 또는 **TanStack Query (React Query)** 와 같은 라이브러리를 사용하는 것이 권장됩니다.

### 4. API Routes (Route Handlers)

`app/api` 디렉토리 내에 `route.ts` 파일을 생성하여 API 엔드포인트를 만들 수 있습니다. 서버 컴포넌트에서 직접 데이터베이스에 접근할 수도 있지만, 클라이언트에서 직접 호출해야 하는 API가 필요할 때 유용합니다.

```ts
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const users = [{ id: 1, name: 'John' }];
  return NextResponse.json({ users });
}
```

## Pages Router (기존 방식)

Pages Router에서는 페이지별로 특별한 데이터 페칭 함수를 `export`하여 사용합니다.

-   **`getStaticProps`**: **빌드 시점**에 데이터를 가져와 페이지를 미리 렌더링합니다 (SSG - Static Site Generation).
-   **`getServerSideProps`**: **매 요청 시마다** 서버에서 데이터를 가져와 페이지를 렌더링합니다 (SSR - Server-Side Rendering).
-   **`getStaticPaths`**: 동적 라우팅 (`/posts/[id]`)에서 `getStaticProps`와 함께 사용되며, 빌드 시점에 미리 생성할 경로들의 목록을 지정합니다.
