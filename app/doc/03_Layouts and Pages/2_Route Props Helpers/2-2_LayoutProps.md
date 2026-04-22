## LayoutProps + 슬롯(props.children / props.analytics) 정리
### 코드
```tsx
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return (
    <section>
      {props.children}
      {props.analytics}
    </section>
  )
}

⸻

폴더 구조

app/dashboard/
  layout.tsx
  page.tsx
  @analytics/
    page.tsx

⸻

각 props에 들어가는 것

1) props.children

개요

* 기본 라우트 영역
* @ 없는 일반 경로의 page

들어가는 값

* 현재 URL 기준으로 매칭된 app/dashboard/.../page.tsx의 렌더 결과

예시

* /dashboard

props.children → <app/dashboard/page.tsx 결과>

* /dashboard/test

props.children → <app/dashboard/test/page.tsx 결과>

⸻

2) props.analytics

개요

* @analytics 슬롯 영역
* 병렬 라우트(Parallel Route)

들어가는 값

* 현재 URL 기준으로 @analytics 내부에서 매칭된 page의 렌더 결과

예시

* /dashboard

props.analytics → <app/dashboard/@analytics/page.tsx 결과>

* /dashboard/test

props.analytics → <app/dashboard/@analytics/test/page.tsx 결과>

⸻

동작 방식

* URL 하나 기준으로
* 각 영역(children, analytics)이 각자 자기 경로에서 page를 찾음
* 결과적으로 여러 UI가 동시에 렌더링됨

⸻

언제 무엇을 사용하나

props.children

* 기본 페이지 콘텐츠
* 메인 영역

예:

* 게시글 내용
* 리스트
* 메인 대시보드

⸻

props.analytics

* 보조 UI / 독립적인 영역

예:

* 통계 패널
* 사이드바
* 추가 정보 UI

⸻

핵심 정리

* children → 기본 라우트 (메인 UI)
* @analytics → 별도 슬롯 (보조 UI)
* 둘 다 URL 기준으로 각각 매칭된 page가 들어감
