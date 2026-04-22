## 개요
global-not-found.tsx에서도 metadata 또는 generateMetadata를 통해  
404 페이지의 <head> 정보를 설정할 수 있다.
이 설정은 브라우저 탭 제목, 설명, SEO 관련 메타 태그에 적용된다.

---

## 사용 예시
```ts
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Not Found',
  description: 'The page you are looking for does not exist.',
}

→ Next.js가 자동으로 <head> 영역에 주입

⸻

동작 결과

위 설정은 실제 HTML에서 다음과 같이 적용된다:

<title>Not Found</title>
<meta name="description" content="The page you are looking for does not exist." />

⸻

generateMetadata 사용

정적인 metadata 대신 동적으로 생성 가능:

export async function generateMetadata() {
  return {
    title: 'Not Found',
  }
}

⸻

자동 추가되는 메타 태그 (중요)

Next.js는 404 페이지에 대해 자동으로 다음을 추가한다:

<meta name="robots" content="noindex" />

의미

검색 엔진이 이 페이지를 인덱싱하지 않도록 설정

→ 404 페이지가 검색 결과에 노출되는 것을 방지

⸻

특징

* global-not-found.tsx에서도 metadata 사용 가능
* <html>, <body>를 직접 작성해도 <head>는 자동 관리됨
* SEO 및 브라우저 표시 제어 가능

⸻

언제 사용하는가

* 404 페이지의 브라우저 탭 제목을 설정할 때
* 검색 엔진 노출을 제어할 때
* 사용자에게 명확한 페이지 정보를 제공할 때
