# generateStaticParams 정리

## 1. 개요

generateStaticParams는 Next.js App Router에서 동적 라우트(\[slug\],
\[id\] 등)를 사용할 때,\
빌드 시점에 미리 생성할 페이지 목록을 정의하는 기능이다.
=> 예를들어 list 페이지에서 특정 패이지를 미리 렌더링 하기위해 db에 등록하고 그걸 가져와서 미리 렌더링 해 놓는것

이 기능은 특정 URL들을 미리 HTML로 생성(Static Generation)하여\
요청 시 서버 실행 없이 빠르게 응답하도록 만든다.

핵심 개념은 다음과 같다.

-   동적 라우트에서 생성 가능한 URL 목록을 미리 정의
-   빌드 시점에 해당 페이지들을 HTML로 생성
-   이후 요청 시 캐시된 결과를 반환
-   개발자가 build시에 html로 저장이 됨
-   자주 변하지 않고 완전 정적(예측 가능한)인 페이지에서 사용 추천

------------------------------------------------------------------------

## 2. 사용 예시 (언제 사용하는가)

다음과 같은 상황에서 사용된다.

### 1) 블로그 / 게시글 시스템

-   게시글이 DB에 저장되어 있고 URL이 존재하는 경우
-   예: /post/react-next, /post/nextjs-guide

### 2) 상품 상세 페이지

-   상품 목록이 고정되거나 주기적으로 업데이트되는 경우
-   예: /product/iphone15, /product/macbook

### 3) 문서 / 콘텐츠 사이트

-   문서 페이지가 미리 정의되어 있는 경우
-   예: /docs/intro, /docs/setup

### 4) 변경이 적고 조회가 많은 데이터

-   인기 게시글, 공지사항 등

------------------------------------------------------------------------

## 3. 사용하지 않는 경우

다음 경우에는 사용하지 않는 것이 일반적이다.

-   ID가 완전히 랜덤 (UUID, 세션 등)
-   실시간 데이터 (피드, 채팅, 알림)
-   사용자 개인 데이터 (/user/profile)

이 경우 SSR 또는 ISR을 사용한다.

------------------------------------------------------------------------

## 4. 동작 구조

1.  generateStaticParams 실행
2.  DB 또는 API에서 URL 목록 조회
3.  각 URL에 대해 페이지 HTML 생성
4.  빌드 결과물로 저장
5.  요청 시 즉시 반환

------------------------------------------------------------------------

## 5. 예시 코드 (list 데이터와 상세 페이지 생성 연결 구조)

핵심은 list 페이지가 detail 페이지를 직접 “생성”하는 것이 아니라,
같은 DB 조회 로직을 공유하면서 역할만 분리하는 구조입니다.

⸻

공통 데이터 함수

async function getPosts() {
  return await db.post.findMany({
    orderBy: { viewCount: "desc" }
  })
}

⸻

1) list 페이지 (목록 화면)

// app/post/page.tsx
export default async function Page() {
  const posts = await getPosts()
  return (
    <div>
      {posts.map(post => (
        <a key={post.id} href={`/post/${post.id}`}>
          {post.title}
        </a>
      ))}
    </div>
  )
}

역할:

* DB에서 게시글 목록 조회
* 상세 페이지로 이동할 링크 제공

⸻

2) generateStaticParams (상세 페이지 미리 생성)

// app/post/[postId]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(post => ({
    postId: post.id
  }))
}

역할:

* list와 같은 데이터 소스를 사용
* 해당 id 목록을 기반으로 상세 페이지를 빌드 시 미리 생성

⸻

3) detail 페이지 (개별 게시글)

export default async function Page({ params }) {
  const post = await db.post.findUnique({
    where: { id: params.postId }
  })
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}

역할:

* 특정 id 기반 상세 데이터 렌더링

------------------------------------------------------------------------

## 6. 실제 동작 예시

### 빌드 시

-   인기 게시글 20개 조회
-   각 게시글 페이지 HTML 생성

예: - /post/1 - /post/2 - /post/3

------------------------------------------------------------------------

### 요청 시

#### 이미 생성된 페이지

-   /post/1 → 즉시 응답

#### 생성되지 않은 페이지

-   /post/9999 → 서버에서 생성 후 캐싱

------------------------------------------------------------------------

## 7. 핵심 정리

-   generateStaticParams = 동적 라우트의 "미리 생성할 페이지 목록 정의"
-   전체를 만드는 기능이 아니라 일부를 선택하는 기능
-   성능 최적화(SSR 제거)를 위한 기능
