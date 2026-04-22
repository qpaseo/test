## 개요

Suspense는 React에서 제공하는 기능으로, **비동기 작업이 완료되지 않은 컴포넌트의 렌더링을 잠시 중단하고, 대신 fallback(UI)을 보여주는 경계(boundary)**이다.

Next.js(App Router)에서는 Suspense를 통해:

* 컴포넌트 단위로 로딩 상태를 분리하고
* Streaming 렌더링이 가능해진다

즉, Suspense는:

“이 컴포넌트가 아직 준비되지 않았다면 여기서 멈추고, 대신 다른 UI를 보여라”는 선언이다

⸻

## 예시

import { Suspense } from "react"
export default function Page() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  )
}

⸻

동작 구조

1. Page 렌더 시작
2. PostFeed → 데이터 없음
   → Suspense에서 멈춤
   → fallback 표시 (Loading feed...)
3. Weather → 데이터 있음
   → 바로 렌더링
4. PostFeed 완료
   → 실제 UI로 교체

⸻

핵심 역할

1) 렌더링 중단 지점 정의

“이 컴포넌트 아직 준비 안 됨”
→ 여기서 멈춤

⸻

2) fallback UI 제공

로딩 중일 때 보여줄 UI 정의

⸻

3) Streaming 분할 기준 제공

어디까지 먼저 보내고
어디부터 나중에 보낼지 결정

⸻

## 사용 예시

1) 데이터 로딩 분리

- 게시글 목록 (느림)
- 날씨 (빠름)

→ 각각 독립적으로 로딩

⸻

2) 대시보드

- 그래프
- 알림
- 최근 활동

→ 부분적으로 먼저 표시

⸻

3) 외부 API 혼합

- 내부 데이터 (빠름)
- 외부 API (느림)

→ 느린 API 때문에 전체 지연 방지

⸻

언제 사용하는가

* 비동기 컴포넌트가 여러 개일 때
* 일부만 먼저 보여줘도 UX가 개선될 때
* 데이터 로딩 속도가 서로 다를 때
* Streaming 효과를 활용하고 싶을 때

⸻

언제 사용하지 않는가

* 데이터가 하나뿐인 단순 페이지
* 전체가 동시에 보여져야 하는 경우
* fallback이 의미 없는 UI
