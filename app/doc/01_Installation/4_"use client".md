## 개요

"use client"는 Next.js App Router에서 해당 파일을 Client Component로 강제 지정하는 지시문이다.

기본적으로 App Router의 컴포넌트는 Server Component(서버에서 만들어주는 html [정적])이며, "use client"를 선언하면 브라우저에서 실행되는 React 컴포넌트로 전환된다.

Client Component가 되면 다음이 가능해진다:

* useState, useEffect 등 React hooks 사용
* window, document 접근
* 이벤트 핸들러(onClick 등) 사용
* 브라우저 API 사용

⸻

## 예시 (언제 사용 / 사용하지 않는지)

1) 사용하는 경우 (Client Component 필요)

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

사용 상황:

* 클릭 이벤트 처리
* 상태 관리 (useState)
* 인터랙션 UI (모달, 토글, 드롭다운)
* 브라우저 API 필요할 때

⸻

2) 사용하지 않는 경우 (Server Component)

export default async function Page() {
  const data = await db.post.findMany()
  return (
    <div>
      {data.map(d => (
        <p key={d.id}>{d.title}</p>
      ))}
    </div>
  )
}

사용 상황:

* 데이터 fetch
* SEO 필요한 페이지
* 서버에서만 처리 가능한 로직
* 정적 렌더링

⸻

3) 혼합 구조 (권장 패턴)

Server Component + Client Component 분리

// Server Component
export default async function Page() {
  const data = await getData()
  return <ClientList data={data} />
}
"use client"
export function ClientList({ data }) {
  const [filter, setFilter] = useState("")
  return (
    <div>
      <input onChange={(e) => setFilter(e.target.value)} />
      {data.filter(d => d.name.includes(filter))}
    </div>
  )
}

⸻

## 사용 예시 (실제 구조)

1) 인터랙티브 UI

"use client"
export function Modal({ open }) {
  if (!open) return null
  return (
    <div onClick={() => console.log("close")}>
      Modal Content
    </div>
  )
}

⸻

2) URL 상태 변경 (router / history)

"use client"
import { usePathname } from "next/navigation"
export function LocaleSwitcher() {
  const pathname = usePathname()
  return (
    <button onClick={() => {
      window.history.replaceState(null, "", "/en" + pathname)
    }}>
      English
    </button>
  )
}

⸻

3) 상태 기반 UI (검색/필터)

"use client"
import { useState } from "react"
export function SearchBox() {
  const [query, setQuery] = useState("")
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}

⸻

핵심 정리

* "use client" = 브라우저에서 실행되는 React 컴포넌트로 전환
* hooks, 이벤트, window 사용 가능
* 기본은 Server Component (SSR)
* 필요한 부분만 Client로 분리하는 구조가 핵심
* 성능 구조상 “최소한으로 사용하는 것”이 권장됨