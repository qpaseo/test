# NextAuth.js (Auth.js)

- **카테고리**: 인증 (Authentication)
- **설명**: Next.js 애플리케이션을 위한 완전한 인증 솔루션입니다. 소셜 로그인(Google, GitHub, Facebook 등), 이메일/패스워드, 매직 링크 등 다양한 인증 방식을 매우 쉽게 구현할 수 있도록 도와줍니다. 현재는 `Auth.js`라는 이름으로 프레임워크에 독립적인 프로젝트로 발전하고 있습니다.

## 핵심 특징

- **다양한 프로바이더**: 50개 이상의 OAuth 프로바이더(Google, GitHub, Kakao, Naver 등)를 기본적으로 지원하며, 커스텀 프로바이더도 쉽게 추가할 수 있습니다.
- **세션 관리**: JWT 또는 데이터베이스 세션 전략을 지원하여 사용자 로그인 상태를 안전하게 관리합니다.
- **보안**: CSRF 토큰, 쿠키 암호화 등 보안 모범 사례가 기본적으로 적용되어 있습니다.
- **유연성**: 콜백 함수를 통해 인증 프로세스의 특정 단계(e.g., `signIn`, `jwt`, `session`)에 커스텀 로직을 추가할 수 있습니다.
- **Next.js 통합**: Next.js의 API 라우트(또는 App Router의 Route Handler)를 사용하여 간단하게 인증 API를 설정할 수 있습니다.

## 기본 사용법 (App Router 기준)

1.  **API Route Handler 생성**: `app/api/auth/[...nextauth]/route.ts` 경로에 파일을 생성하고 인증 옵션을 설정합니다.

    ```typescript
    // app/api/auth/[...nextauth]/route.ts
    import NextAuth from 'next-auth';
    import GithubProvider from 'next-auth/providers/github';
    import GoogleProvider from 'next-auth/providers/google';

    const handler = NextAuth({
      providers: [
        GithubProvider({
          clientId: process.env.GITHUB_ID!,
          clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ],
      // 추가적인 콜백, 페이지 설정 등
    });

    export { handler as GET, handler as POST };
    ```

2.  **`SessionProvider` 설정**: 클라이언트 컴포넌트에서 세션 정보를 쉽게 사용하기 위해 최상위 레이아웃에 `SessionProvider`를 추가합니다.

    ```tsx
    // app/providers.tsx
    "use client";
    import { SessionProvider } from "next-auth/react";

    export default function Providers({ children }: { children: React.ReactNode }) {
      return <SessionProvider>{children}</SessionProvider>;
    }

    // app/layout.tsx
    import Providers from "./providers";

    export default function RootLayout({ children }) {
      return (
        <html>
          <body>
            <Providers>{children}</Providers>
          </body>
        </html>
      );
    }
    ```

3.  **컴포넌트에서 세션 사용**: `useSession` Hook을 사용하여 로그인 상태, 사용자 정보 등을 가져올 수 있습니다.

    ```tsx
    "use client";
    import { useSession, signIn, signOut } from "next-auth/react";

    export default function Component() {
      const { data: session, status } = useSession();

      if (status === "loading") return <p>Loading...</p>;

      if (session) {
        return (
          <>
            Signed in as {session.user?.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        );
      }
      return (
        <>
          Not signed in <br />
          <button onClick={() => signIn("google")}>Sign in with Google</button>
        </>
      );
    }
    ```
