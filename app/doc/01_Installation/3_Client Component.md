## 개요

Client Component는 Next.js에서 브라우저에서 실행되는 React 컴포넌트이다.

핵심 역할은 다음과 같다:

* 사용자 인터랙션 처리 (클릭, 입력 등)
* 상태 관리 (useState, useReducer)
* 브라우저 API 사용 (window, document)
* 동적 UI 변경

파일 상단에 "use client"를 선언하면 Client Component로 동작한다.

⸻

## 특징

* "use client" 선언 필요
* 브라우저에서 실행됨
* React Hooks 사용 가능 (useState, useEffect 등)
* 이벤트 처리 가능 (onClick, onChange)
* Server Component를 내부에서 import 가능 (반대는 불가)

⸻

## 예시

1) 기본 상태 관리

"use client"
import { useState } from "react"
export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}

⸻

2) 입력 기반 UI

"use client"
import { useState } from "react"
export default function SearchBox() {
  const [value, setValue] = useState("")
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

⸻

동작 구조

1. 서버에서 HTML 전달
2. 브라우저에서 JS 로드
3. React hydration 진행
4. Client Component 활성화
5. 이벤트 / 상태 동작 시작

⸻

## 사용 예시

1) 버튼 / 토글 UI

* 좋아요 버튼
* 메뉴 열기/닫기
* 모달

[Like 버튼]
[Modal 열기]
[Dropdown]

⸻

2) 필터 / 정렬 UI

"use client"
import { useState } from "react"
export default function Sort() {
  const [sort, setSort] = useState("asc")
  return (
    <>
      <button onClick={() => setSort("asc")}>ASC</button>
      <button onClick={() => setSort("desc")}>DESC</button>
    </>
  )
}

⸻

3) URL 상태 변경 (router / history)

"use client"
import { usePathname } from "next/navigation"
export default function LocaleSwitcher() {
  const pathname = usePathname()
  function switchLang(lang: string) {
    window.history.replaceState(null, "", `/${lang}${pathname}`)
  }
  return (
    <>
      <button onClick={() => switchLang("en")}>EN</button>
      <button onClick={() => switchLang("ko")}>KO</button>
    </>
  )
}

⸻

언제 사용하는가

* 사용자 입력이 필요한 경우
* 클릭/스크롤/드래그 등 이벤트 처리
* 상태가 실시간으로 바뀌는 UI
* 브라우저 API 필요할 때
* 인터랙티브 UI (모달, 탭, 드롭다운)

⸻

언제 사용하지 않는가

* 단순 데이터 표시 페이지
* SEO 중심 페이지
* 서버에서만 처리 가능한 데이터 fetch
* 불필요하게 전체 페이지를 클라이언트로 만들 때

