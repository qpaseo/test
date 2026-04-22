
## 개요
mdx-components.tsx 는 Next.js(App Router)에서 MDX를 사용할 때,  
MDX 내부에서 생성되는 HTML 요소 및 JSX 컴포넌트를 어떤 React 컴포넌트로 렌더링할지 정의하는 전역 매핑 파일이다. 이 파일은 MDX 렌더링 과정에서 자동으로 참조되며, 별도의 import 없이 적용된다.

---
## 필수 구조
```tsx
import type { MDXComponents } from 'mdx/types'
const components: MDXComponents = {}
export function useMDXComponents(): MDXComponents {
  return components
}
```
핵심 포인트

* useMDXComponents 함수는 반드시 export 해야 함
* Next.js가 내부적으로 이 함수를 호출하여 MDX 렌더링에 사용

⸻

## 예시

1) HTML 태그 스타일 커스터마이징

const components = {
  h1: (props) => <h1 style={{ fontSize: '40px' }} {...props} />,
  p: (props) => <p style={{ lineHeight: 1.8 }} {...props} />,
}

→ 모든 MDX 문서에 동일하게 적용

⸻

2) 이미지 컴포넌트 교체

import Image from 'next/image'
const components = {
  img: (props) => <Image {...props} />
}

→ Markdown의 <img>를 Next Image로 자동 변환

⸻

3) 커스텀 컴포넌트 연결

<MyButton />
const components = {
  MyButton: () => <button>Click</button>
}

⸻

## 사용 예시

1) 블로그 / 문서

* Markdown 기반 콘텐츠
* 공통 스타일 유지 필요

⸻

2) 기술 문서

* 코드 블록, 강조 UI
* 인터랙티브 컴포넌트 삽입

⸻

3) CMS 기반 콘텐츠

* 작성자와 개발자 역할 분리
* UI 일관성 유지

⸻

언제 사용하는가

* MDX를 사용하는 경우
* Markdown 기반 콘텐츠에 UI를 결합할 때
* 문서 스타일을 전역으로 통제하고 싶을 때

⸻

언제 사용하지 않는가

* MDX를 사용하지 않는 일반 React 페이지
* 단순 UI 페이지 (문서 구조 없음)

⸻

역할 범위 (중요)

mdx-components는:

디자인 시스템 → UI 컴포넌트 → mdx-components → MDX 문서

즉,

* 스타일을 직접 정의하기보다
* 기존 UI 컴포넌트를 MDX에 연결하는 역할

⸻

다른 레이어와의 역할 분리

레이어	역할
globals.css	기본 스타일
tailwind.config	디자인 토큰
UI 컴포넌트	스타일/정책 구현
mdx-components	MDX에 연결
