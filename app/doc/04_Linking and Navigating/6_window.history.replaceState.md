## 개요

이 코드는 현재 URL 경로를 유지한 상태에서 언어(locale) prefix만 바꾸는 방식이다.

핵심은:

* usePathname()으로 현재 경로를 가져옴
* /en, /fr 같은 prefix를 붙여 새로운 URL 생성
* window.history.replaceState로 URL만 교체 (페이지 이동 없음)

replaceState는 pushState와 달리 히스토리를 추가하지 않고 현재 상태를 덮어쓴다

⸻

## 예시

현재 URL:

https://site.com/about

⸻

1. English 클릭

const newPath = `/en${pathname}`
window.history.replaceState(null, '', newPath)

결과:

https://site.com/en/about

⸻

2. French 클릭

https://site.com/fr/about

⸻

3. 다른 페이지에서

https://site.com/contact

→ English 선택 시:

https://site.com/en/contact

⸻

## 사용 예시

1) 다국어 사이트 (i18n)

/en/about
/fr/about
/ko/about

* 같은 페이지 구조 유지
* 언어만 변경

⸻

2) 언어 토글 UI

[English] [한국어] [Français]

* 페이지 리로드 없이 언어 변경

⸻

3) SEO 구조 기반 i18n

* 각 언어별 URL을 독립적으로 유지
* 검색 엔진 최적화 가능

⸻

언제 사용하는가

* 다국어 사이트
* URL 구조는 유지하면서 prefix만 변경할 때
* SPA처럼 빠른 언어 전환이 필요할 때
* 히스토리 남길 필요 없을 때 (replaceState 사용)

⸻

언제 사용하지 않는가

* 실제 페이지 이동이 필요한 경우 (/login → /dashboard)
* 서버 라우팅을 다시 타야 하는 경우
* 상태 변경이 단순 URL 변경을 넘는 경우
* SEO 구조가 아닌 내부 상태 관리 용도

⸻

replaceState 특징

1) 히스토리 기록 없음

A → B → C (replaceState)

결과:

* B 기록 없음
* 뒤로가기 시 A로 바로 이동

⸻

2) 페이지 새로고침 없음

* React state 유지
* Next.js 재렌더 최소화

