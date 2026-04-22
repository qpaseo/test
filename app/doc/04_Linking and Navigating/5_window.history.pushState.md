## 개요

이 코드는 Next.js App Router에서 쿼리스트링(searchParams)을 이용해 정렬 상태를 변경하는 방식이다.

핵심은 페이지 이동(Link) 없이:

* URL의 ?sort=asc 같은 값만 변경
* 브라우저 히스토리를 이용해 상태를 관리
* 페이지는 그대로 유지하면서 데이터만 변경

window.history.pushState는 페이지 새로고침 없이 URL만 바꾸는 브라우저 API이다.

⸻

## 예시

기본 URL 상태:

https://site.com/products

⸻

1. asc 버튼 클릭

params.set('sort', 'asc')
window.history.pushState(null, '', '?sort=asc')

결과 URL:

https://site.com/products?sort=asc

⸻

2. desc 버튼 클릭

window.history.pushState(null, '', '?sort=desc')

결과 URL:

https://site.com/products?sort=desc

⸻

3. 기존 상태에서 추가 파라미터

예: ?sort=asc&page=2

https://site.com/products?sort=asc&page=2

⸻

## 사용 예시

1) 필터 / 정렬 UI

상품 정렬:
- 가격 낮은 순
- 가격 높은 순
- 최신순

→ 페이지 이동 없이 URL만 변경

⸻

2) 검색 결과 상태 유지

/search?q=react&sort=asc

→ 새로고침해도 상태 유지 가능

⸻

3) 탭 UI

/profile?tab=posts
/profile?tab=likes

→ SPA처럼 탭 전환

⸻

언제 사용하는가

* 페이지 이동 없이 상태만 바꿀 때
* 필터 / 정렬 / 탭 UI
* 검색 조건 유지가 필요할 때
* 뒤로가기(history) 기능을 활용해야 할 때

⸻

언제 사용하지 않는가

* 실제 페이지 이동이 필요한 경우 (/blog/123)
* 서버 라우팅이 필요한 경우 (SSR page 전환)
* SEO 목적의 페이지 이동
* 중요한 상태 변경 (로그인, 결제 등)

⸻

pushState 동작 특징

1) 페이지는 새로 렌더링되지 않음

* React state는 유지
* 화면 그대로 유지

⸻

2) URL만 변경됨

기존: /products
변경: /products?sort=asc

⸻

3) 브라우저 히스토리에 기록됨

* 뒤로가기 가능
* 앞으로가기 가능

