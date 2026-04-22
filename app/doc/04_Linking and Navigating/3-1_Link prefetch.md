1. 개요

이 컴포넌트는 next/link의 prefetch 동작을 “마우스 hover 시점”으로 지연 제어하는 패턴이다.

기본 Link는 자동으로 prefetch를 수행하지만, 이 방식은:

* 처음엔 prefetch를 막고
* 사용자가 링크에 마우스를 올렸을 때만 prefetch를 활성화

즉, 불필요한 네트워크 요청을 줄이면서도 UX는 유지하는 구조다.

⸻

2. 코드

'use client'
import Link from 'next/link'
import { useState } from 'react'
function HoverPrefetchLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const [active, setActive] = useState(false)
  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}

⸻

1. 사용 예시

2) 무거운 페이지 링크

<HoverPrefetchLink href="/dashboard">
  Dashboard
</HoverPrefetchLink>

적합 상황:

* 대시보드
* 관리자 페이지
* 무거운 데이터 페이지

⸻

2) 리스트 → 상세 이동

<HoverPrefetchLink href="/post/123">
  게시글 보기
</HoverPrefetchLink>

적합 상황:

* 게시글 상세
* 상품 상세

⸻

5. 언제 사용하는가

* prefetch 트래픽이 부담될 때
* 페이지가 무거운 경우
* 리스트가 많아 자동 prefetch가 과도할 때
* 사용자 hover 패턴이 명확한 UI

⸻

6. 언제 사용하지 않는가

* 단순한 내부 네비게이션 (홈, 소개 등)
* 가벼운 페이지
* prefetch 자체가 문제되지 않는 경우


