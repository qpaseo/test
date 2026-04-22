## 개요
global-not-found.tsx는 Next.js(App Router)에서 어떤 라우트에도 매칭되지 않는 경우 보여줄 전역 404 페이지를 정의하는 파일이다.
즉,
- 존재하지 않는 URL 접근
- 어떤 route에도 해당하지 않는 요청
에 대해 최종적으로 렌더링되는 전역 fallback UI이다.

---
## 예시

기본 구조

// app/global-not-found.tsx
export default function GlobalNotFound() {
  return (
    <html>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>존재하지 않는 페이지입니다.</p>
      </body>
    </html>
  )
}

⸻

특징

1) 전체 앱에 적용

모든 route 매칭 실패 시 실행

⸻

2) layout을 거치지 않음

기존 layout.tsx 사용 안 함

→ 따라서 직접 HTML 구조 작성 필요

⸻

3) 완전 독립 페이지

html / body 직접 작성

→ 일반 페이지와 다르게 동작

⸻

4) Server Component

* 서버에서 렌더링됨
* async 사용 가능

⸻

# 사용 예시

1) 잘못된 URL 접근

/abc/xyz

→ 어떤 route에도 없음 → global-not-found 실행

⸻

2) 외부 링크 오류

잘못된 링크로 접근

→ 전체 fallback 처리

⸻

3) 서비스 외 경로

존재하지 않는 구조

→ 안전하게 차단

⸻

언제 사용하는가

* 전체 앱의 404 페이지를 커스터마이징할 때
* 라우트 매칭 실패 상황을 처리할 때
* 사용자에게 일관된 404 경험 제공

⸻

언제 사용하지 않는가

* 데이터가 없는 경우 처리 (→ notFound 사용)
* 특정 route 내부에서 처리할 때
* 단순 UI 상태 처리

