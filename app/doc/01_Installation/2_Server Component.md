## 개요

Server Component는 Next.js(App Router)에서 서버에서 실행되는 React 컴포넌트이다.

핵심 역할은 다음과 같다:

* 서버에서 데이터 조회
* UI 구조 생성 (React Tree 생성)
* 결과를 HTML/RSC 형태로 클라이언트에 전달

브라우저에서는 실행되지 않는다.

⸻

## 특징

* 기본값 (별도 "use client" 없으면 Server Component)
* useState, useEffect 사용 불가
* window, document 접근 불가
* DB 직접 접근 가능
* API 호출 가능 (서버에서 실행)

⸻

## 예시

1) 기본 Server Component

export default async function Page() {
  const posts = await db.post.findMany()
  return (
    <div>
      {posts.map(post => (
        <p key={post.id}>{post.title}</p>
      ))}
    </div>
  )
}

⸻

2) 데이터 기반 페이지

export default async function ProductPage() {
  const product = await fetchProduct()
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.price}</p>
    </div>
  )
}

⸻

동작 구조

1. 서버에서 컴포넌트 실행
2. DB/API 데이터 가져옴
3. React Tree 생성
4. HTML로 변환
5. 클라이언트에 전달

⸻

## 사용 예시

1) 블로그 / 문서 페이지

* SEO 중요
* 정적 콘텐츠
* 데이터 fetch 필요

/blog/react-next
/docs/intro

⸻

2) 상품 상세 페이지

* 서버에서 상품 정보 조회
* 클라이언트 상태 필요 없음 (초기 화면 기준)

/product/123

⸻

3) 리스트 페이지

export default async function ListPage() {
  const items = await getItems()
  return (
    <ul>
      {items.map(i => <li key={i.id}>{i.name}</li>)}
    </ul>
  )
}

⸻

언제 사용하는가

* SEO가 필요한 페이지
* 초기 데이터가 중요한 페이지
* DB 기반 렌더링
* 무거운 로직을 클라이언트에서 제외하고 싶을 때

⸻

언제 사용하지 않는가

* 클릭/입력/드래그 등 UI 인터랙션이 많은 경우
* useState / useEffect 필요할 때
* 브라우저 API 사용 필요할 때
* 실시간 상태 관리 UI

