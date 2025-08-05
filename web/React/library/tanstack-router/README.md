# TanStack Router

## 1. 이름
**TanStack Router**

## 2. 설명
TanStack Router는 React를 위해 처음부터 타입스크립트를 기반으로 설계된 최신 라우팅 라이브러리입니다. **100% 타입 안전성(Type-Safety)**을 목표로 하며, 검색 파라미터(search parameters)를 상태 관리의 핵심 요소로 활용하는 독특한 접근 방식을 취합니다. 이를 통해 URL을 신뢰할 수 있는 단일 정보 소스(Single Source of Truth)로 만들어 애플리케이션의 상태를 예측 가능하고 관리하기 쉽게 만듭니다.

## 3. 사용되는 상황
- 새로운 React 프로젝트에서 타입스크립트를 기반으로 완벽한 타입 안전성을 갖춘 라우팅을 구현하고 싶을 때
- URL의 검색 파라미터(예: `?page=2&filter=done`)를 통해 필터링, 정렬, 페이지네이션 등의 상태를 관리해야 할 때
- 라우트 경로, 파라미터, 검색 파라미터 등을 사용할 때 자동 완성과 타입 체크의 이점을 누리고 싶을 때
- 파일 기반 라우팅(File-based routing)과 유사한 편리함을 코드 기반(Code-based) 라우팅에서 구현하고 싶을 때
- 데이터 로딩, 에러 처리, 리디렉션 등 라우팅과 관련된 비동기 작업을 내장 기능으로 손쉽게 처리하고 싶을 때

## 4. 사용하면 좋은 이유
- **완벽한 타입 안전성:** 경로 파라미터, 검색 파라미터 등 라우팅의 모든 요소가 타입스크립트에 의해 추론되고 검증됩니다. 잘못된 경로로 이동하거나 잘못된 파라미터를 사용하는 실수를 컴파일 타임에 방지할 수 있습니다.
- **검색 파라미터 기반 상태 관리:** URL 검색 파라미터를 상태 관리의 일급 시민으로 취급하여, URL만으로 현재 페이지의 상태(필터, 정렬 등)를 완벽하게 표현하고 복원할 수 있습니다. 이는 상태 공유, 북마크, 새로고침 시 상태 유지에 매우 강력합니다.
- **내장 데이터 로딩:** 각 라우트는 데이터를 미리 로드하는 `loader` 함수를 가질 수 있습니다. TanStack Query와 유사하게 로딩 및 에러 상태를 자동으로 처리하며, 렌더링 전에 데이터 로딩을 보장할 수 있습니다.
- **성능 최적화:** 라우팅에 필요한 데이터만 로드하고, 캐싱 및 미리 불러오기(pre-fetching) 기능을 내장하여 사용자 경험을 향상시킵니다.
- **개발 경험:** 자동 완성과 강력한 타입 추론 덕분에 코드 작성이 매우 편리하고 실수가 줄어듭니다.

## 5. 예시 코드 (React 기준)

### 라우트 설정 및 생성
```jsx
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { z } from 'zod';

// 검색 파라미터의 타입을 Zod로 정의하고 검증
const searchSchema = z.object({
  page: z.number().int().min(1).catch(1), // page는 숫자, 최소 1, 잘못되면 1로 대체
  filter: z.string().optional(), // filter는 문자열, 선택적
});

// 1. 루트 라우트 생성
const rootRoute = createRootRoute({
  component: () => (
    <div>
      <h1>My App</h1>
      <hr />
      <Outlet /> {/* 자식 라우트가 렌더링될 위치 */}
    </div>
  ),
});

// 2. /posts 라우트 생성 (루트의 자식)
const postsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'posts',
  // 이 라우트의 검색 파라미터를 검증
  validateSearch: (search) => searchSchema.parse(search),
  // 데이터를 미리 로드하는 loader 함수
  loader: async ({ searchParams }) => {
    console.log('Current Page:', searchParams.page);
    // const posts = await fetchPosts(searchParams);
    // return posts;
  },
  component: PostsComponent,
});

function PostsComponent() {
  // 타입이 완벽하게 추론되는 searchParams!
  const { page, filter } = postsRoute.useSearch();
  // const posts = postsRoute.useLoaderData();

  return (
    <div>
      <h2>Posts</h2>
      <p>Current Page: {page}</p>
      <p>Filter: {filter || 'None'}</p>
      {/* ... posts 렌더링 ... */}
    </div>
  );
}

// 3. 라우트 트리 구성
const routeTree = rootRoute.addChildren([postsRoute]);

// 4. 라우터 인스턴스 생성
const router = createRouter({ routeTree });

// 5. 앱에 라우터 제공
function App() {
  return <RouterProvider router={router} />;
}
```

## 6. 입문자를 위한 정보
- **Zod와 함께 사용하기:** TanStack Router는 `Zod` 같은 스키마 검증 라이브러리와 함께 사용할 때 매우 강력합니다. URL 파라미터는 항상 문자열로 들어오기 때문에, `Zod`를 사용해 원하는 타입(숫자, 불리언 등)으로 안전하게 파싱하고 검증할 수 있습니다.
- **파일 기반 라우팅이 아닙니다:** Next.js처럼 폴더 구조가 URL이 되는 방식은 아니지만, `createRoute`를 통해 계층적으로 라우트를 정의함으로써 파일 기반 라우팅의 장점인 코드 분리와 구조화를 달성할 수 있습니다.
- **URL이 상태입니다:** TanStack Router의 핵심 철학은 "URL을 신뢰의 원천으로 삼는 것"입니다. 모달을 열거나, 탭을 바꾸거나, 필터를 적용하는 등의 상태 변화를 가급적 URL 검색 파라미터로 표현하도록 노력해보세요. 이렇게 하면 뒤로가기, 새로고침, 링크 공유 시에도 UI 상태가 일관되게 유지됩니다.
- **점진적으로 도입 가능:** 기존 프로젝트에 한 번에 모든 것을 바꾸기보다는, 특정 페이지나 기능부터 점진적으로 TanStack Router를 도입할 수 있습니다.
