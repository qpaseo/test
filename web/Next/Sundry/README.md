# Next.js Sundry (기타)

이 문서에서는 Next.js의 핵심 기능 외에 프로덕션 애플리케이션을 구축할 때 중요한 여러 가지 주제들을 다룹니다.

## 1. Image Optimization (`next/image`)

`next/image` 컴포넌트는 HTML의 `<img>` 태그를 확장한 것으로, 이미지 최적화를 자동으로 수행합니다.

-   **크기 최적화**: 빌드 시점에 이미지를 다양한 디바이스 크기에 맞게 여러 버전으로 생성합니다.
-   **최신 포맷 사용**: 브라우저가 지원하는 경우 WebP나 AVIF와 같은 최신 이미지 포맷으로 자동 변환하여 용량을 줄입니다.
-   **지연 로딩 (Lazy Loading)**: 이미지가 뷰포트에 들어올 때만 로드하여 초기 페이지 로딩 속도를 향상시킵니다. (기본값)
-   **CLS 방지 (Cumulative Layout Shift)**: 이미지의 너비와 높이를 미리 알고 있어, 이미지가 로드될 때 레이아웃이 밀리는 현상을 방지합니다.

```tsx
import Image from 'next/image';
import profilePic from '../public/me.png';

export default function Profile() {
  return <Image src={profilePic} alt="Picture of the author" />;
}
```

## 2. Script Optimization (`next/script`)

`next/script` 컴포넌트는 서드파티 스크립트(e.g., Google Analytics, SDKs)를 페이지에 추가할 때 로딩 시점을 제어하여 성능을 최적화합니다.

-   **`strategy` 속성**:
    -   `beforeInteractive`: 페이지가 상호작용 가능해지기 전에 스크립트를 로드합니다. (매우 중요한 스크립트에만 사용)
    -   `afterInteractive` (기본값): 페이지가 상호작용 가능해진 후에 스크립트를 로드합니다. (대부분의 경우 권장)
    -   `lazyOnload`: 브라우저가 유휴 상태일 때 스크립트를 로드합니다.

```tsx
import Script from 'next/script';

export default function Home() {
  return (
    <>
      <Script src="https://www.google-analytics.com/analytics.js" strategy="lazyOnload" />
    </>
  );
}
```

## 3. Middleware

미들웨어는 요청(request)이 완료되기 전에 코드를 실행할 수 있게 해줍니다. 페이지나 API로의 요청이 처리되기 전에 중간에서 요청을 가로채거나 응답을 수정할 수 있습니다.

-   **사용 사례**:
    -   인증 및 권한 부여 (로그인되지 않은 사용자를 로그인 페이지로 리디렉션)
    -   A/B 테스팅
    -   사용자 지역에 따른 페이지 보여주기 (i18n)
    -   봇 탐지
-   프로젝트의 루트에 `middleware.ts` 파일을 생성하여 작성합니다.

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // 인증 로직...
    // 만약 인증되지 않았다면,
    // return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
```

## 4. Environment Variables (환경 변수)

Next.js는 `.env.local` 파일을 통해 환경 변수를 로드하는 것을 기본적으로 지원합니다.

-   **서버 전용**: `process.env.DB_HOST`와 같이 `NEXT_PUBLIC_` 접두사 없이 정의된 변수는 서버 측(서버 컴포넌트, `getServerSideProps`, API Routes 등)에서만 접근 가능합니다.
-   **클라이언트 노출**: `NEXT_PUBLIC_` 접두사를 붙인 변수(`process.env.NEXT_PUBLIC_API_URL`)는 브라우저에서 접근할 수 있도록 인라인됩니다. 민감한 정보는 절대 이 접두사를 사용해서는 안 됩니다.

## 5. Font Optimization (폰트 최적화)

`next/font` 모듈은 웹 폰트를 자동으로 최적화하고, 폰트 파일을 호스팅하여 개인 정보 보호와 성능을 향상시킵니다.

-   빌드 시점에 폰트 파일을 다운로드하여 다른 에셋과 함께 호스팅합니다.
-   CLS(Cumulative Layout Shift)를 방지하기 위해 `size-adjust`와 같은 CSS 속성을 자동으로 설정합니다.

```tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```
