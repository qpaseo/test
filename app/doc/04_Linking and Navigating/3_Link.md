1. 개요

next/link는 Next.js에서 페이지 이동을 위한 컴포넌트.
기존 <a> 태그 대신 사용하며, **클라이언트 사이드 라우팅 + 성능 최적화(prefetch)**를 위해 사용함

핵심 기능:

* 페이지 새로고침 없이 이동
* 필요한 JS만 로드
* 기본적으로 링크된 페이지를 미리 가져옴 (prefetch)

⸻

1. 예시

import Link from "next/link"
export default function Nav() {
  return (
    <nav>
      <Link href="/blog">Blog</Link>
    </nav>
  )
}

⸻

3. 사용 예시

1) 기본 사용 (권장)

<Link href="/post/1">게시글 보기</Link>

사용 상황:

* 일반적인 페이지 이동
* 블로그, 리스트 → 상세 이동
* 내부 라우팅

⸻

2) prefetch 끄는 경우

<Link prefetch={false} href="/blog">
  Blog
</Link>

사용 상황:

* 해당 페이지가 무겁거나 필요 없는 경우
* 로그인 이후에만 접근 가능한 페이지
* 트래픽 비용 줄이고 싶을 때

⸻

3) 외부 링크 (사용하지 않음)

<a href="https://google.com">Google</a>

사용 상황:

* 외부 사이트 이동
* Next.js 라우팅이 아닌 경우

⸻

4. 언제 사용하는가

* 내부 페이지 이동 (필수)
* SPA처럼 빠른 전환 필요할 때
* 페이지 간 이동이 많은 서비스 (블로그, 커뮤니티, 쇼핑몰)

⸻

5. 언제 사용하지 않는가

* 외부 URL 이동
* 다운로드 링크
* POST 요청/폼 제출
* prefetch가 불필요한 무거운 페이지 (옵션으로 끔)

⸻

6. 핵심 정리

* Link = Next.js 내부 라우팅 표준
* 기본적으로 prefetch로 빠른 이동 제공
* 필요 없으면 prefetch={false}로 제어 가능
* 외부 링크는 사용하지 않음
* Link는 초기 JS 활성화가 되어야 prefetch(link 로 연결되어 있으면서 prefetch가 true인 페이지를 미리 불러오는 방식)를 진행함