
## 개요
not-found.tsx는 Next.js(App Router)에서 데이터가 존재하지 않을 때 보여줄 UI를 정의하는 파일이다.
단순히 “존재하지 않는 URL”뿐 아니라,  
페이지는 존재하지만 데이터가 없는 경우에도 사용할 수 있다.

⸻

## 기본 구조

// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>요청한 데이터를 찾을 수 없습니다.</p>
    </div>
  )
}

⸻

## 사용 예시

1) 데이터 조회 실패 처리

// app/post/[id]/page.tsx
import { notFound } from 'next/navigation'
export default async function Page({ params }) {
  const post = await getPost(params.id)
  if (!post) {
    notFound()
  }
  return <div>{post.title}</div>
}


⸻

## 특징

1) Server Component

* 기본적으로 서버 컴포넌트
* async 사용 가능

⸻

2) props 없음

NotFound 컴포넌트는 props를 받지 않음

⸻

3) 명시적 트리거 필요

* 자동으로 실행되지 않음
* 반드시 notFound() 호출 필요

⸻

4) 레이아웃 유지

* 기존 layout 구조 유지한 상태로 렌더링됨

⸻

언제 사용하는가

* 데이터 기반 페이지에서 값이 없는 경우
* 존재하지 않는 리소스 접근
* 권한이 없는 데이터 접근 시 숨김 처리

⸻

언제 사용하지 않는가

* 단순 UI 상태 처리 (빈 상태 UI 등)
* 클라이언트 상태만으로 처리 가능한 경우

