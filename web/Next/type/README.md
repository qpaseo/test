# Next.js with TypeScript

Next.js는 TypeScript를 기본적으로 지원하며, 첫 설정부터 타입스크립트 환경을 매우 쉽게 구성할 수 있습니다. 이 문서에서는 Next.js 프로젝트에서 TypeScript를 활용하는 주요 패턴을 설명합니다.

## 1. 프로젝트 시작

`create-next-app`을 사용하면 TypeScript 프로젝트가 기본으로 생성됩니다.

```bash
npx create-next-app@latest
```

## 2. 페이지 및 컴포넌트 타입

React와 마찬가지로 컴포넌트의 `props` 타입을 정의합니다. Next.js의 App Router에서는 페이지 컴포넌트가 `params`, `searchParams`와 같은 특별한 `props`를 받을 수 있습니다.

### App Router 페이지 `props` 타입

```tsx
// app/blog/[slug]/page.tsx

// 페이지 컴포넌트가 받는 props의 타입을 정의
type PageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function BlogPostPage({ params, searchParams }: PageProps) {
  return (
    <div>
      <h1>Blog Post: {params.slug}</h1>
      <p>Search query: {searchParams.q}</p>
    </div>
  );
}
```

## 3. 데이터 페칭 함수 타입

### App Router (`fetch` in Server Components)

서버 컴포넌트 내에서 `fetch`를 사용할 때는 반환되는 데이터의 타입을 직접 정의하여 사용합니다.

```tsx
type Post = {
  id: number;
  title: string;
  body: string;
};

async function getPost(id: string): Promise<Post> {
  const res = await fetch(`https://api.example.com/posts/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  // 'post'는 'Post' 타입으로 추론됨
  return <h1>{post.title}</h1>;
}
```

### Pages Router (`getServerSideProps`, `getStaticProps`)

`next` 모듈에서 제공하는 제네릭 타입을 사용하여 `props`의 타입을 지정할 수 있습니다.

-   `GetServerSideProps`
-   `GetStaticProps`
-   `GetStaticPaths`

```tsx
// pages/posts/[id].tsx
import type { GetServerSideProps, NextPage } from 'next';

type Post = {
  id: number;
  title: string;
};

// 이 페이지가 받을 props의 타입
type PostPageProps = {
  post: Post;
};

const PostPage: NextPage<PostPageProps> = ({ post }) => {
  return <h1>{post.title}</h1>;
};

export const getServerSideProps: GetServerSideProps<PostPageProps> = async (context) => {
  const { id } = context.params!;
  const res = await fetch(`https://api.example.com/posts/${id}`);
  const post: Post = await res.json();

  return {
    props: {
      post,
    },
  };
};

export default PostPage;
```

## 4. API Routes (Route Handlers) 타입

App Router의 Route Handler나 Pages Router의 API Route에서도 `Request`와 `Response` 객체의 타입을 지정하여 안정성을 높일 수 있습니다.

### App Router (Route Handlers)

```ts
// app/api/users/route.ts
import { NextResponse } from 'next/server';

type User = {
  id: number;
  name: string;
};

export async function GET(request: Request) {
  const users: User[] = [{ id: 1, name: 'John Doe' }];
  return NextResponse.json({ users });
}
```

### Pages Router (API Routes)

```ts
// pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' });
}
```
