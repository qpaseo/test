# Next.js Route Props Helpers 정리

## 개요
Next.js는 라우트 구조를 기반으로 `params`, `searchParams`, `children`, 슬롯 등을 자동으로 추론해주는 타입 헬퍼를 제공한다.
- `PageProps` → 페이지 컴포넌트용
- `LayoutProps` → 레이아웃 컴포넌트용
이 타입들은 별도의 import 없이 전역에서 사용 가능하며, `next dev`, `next build`, `next typegen` 시 자동 생성된다.
---
## 사용 이유
- 라우트 구조에 맞는 타입을 자동으로 생성
- 수동 타입 정의 제거
- 경로 변경 시 타입 자동 반영
- 타입 안정성 향상 및 유지보수 용이
---
## 코드 예시
1. PageProps
```ts
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  return <h1>{slug}</h1>
}

자동 추론:

params: { slug: string }

⸻