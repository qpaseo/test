# Next.js Summary

## What is Next.js?

Next.js는 **React를 위한 프로덕션 프레임워크**입니다. React 라이브러리를 기반으로 풀스택(Full-stack) 웹 애플리케이션을 쉽고 효율적으로 구축할 수 있도록 다양한 기능과 모범 사례를 기본적으로 제공합니다. Vercel에서 개발 및 유지보수하고 있습니다.

## Core Features

1.  **Hybrid Rendering (하이브리드 렌더링)**
    -   Next.js의 가장 큰 특징으로, 페이지별로 렌더링 전략을 선택할 수 있습니다.
    -   **Static Site Generation (SSG)**: 빌드 시점에 페이지를 HTML로 미리 생성합니다. 블로그, 마케팅 페이지 등 컨텐츠가 자주 바뀌지 않는 페이지에 적합하며 매우 빠릅니다.
    -   **Server-Side Rendering (SSR)**: 매 요청마다 서버에서 페이지를 렌더링합니다. 사용자 인증이 필요하거나 데이터가 실시간으로 변경되는 페이지에 적합합니다.
    -   **Incremental Static Regeneration (ISR)**: SSG의 장점을 유지하면서, 일정 시간마다 백그라운드에서 페이지를 다시 생성하여 업데이트할 수 있습니다.
    -   **Client-Side Rendering (CSR)**: 기존 React SPA처럼 클라이언트에서 페이지를 렌더링합니다.

2.  **File-System Based Routing (파일 시스템 기반 라우팅)**
    -   `app` 또는 `pages` 디렉토리의 파일 및 폴더 구조가 자동으로 애플리케이션의 경로가 됩니다. 직관적이고 설정이 필요 없습니다.

3.  **App Router (Next.js 13+ 권장)**
    -   React 서버 컴포넌트(RSC)를 기반으로 하는 새로운 라우팅 및 렌더링 아키텍처입니다.
    -   서버에서 직접 데이터를 가져오고, 서버 컴포넌트를 통해 클라이언트로 전송되는 JavaScript 양을 최소화하여 성능을 극대화합니다.
    -   `layout.tsx`, `loading.tsx`, `error.tsx` 등 특수 파일을 통해 UI를 체계적으로 구성할 수 있습니다.

4.  **Built-in Optimizations (내장 최적화 기능)**
    -   **Image Optimization**: `next/image` 컴포넌트를 통해 이미지를 자동으로 최적화하고, WebP와 같은 최신 포맷으로 변환하며, 지연 로딩(lazy loading)을 지원합니다.
    -   **Script Optimization**: `next/script` 컴포넌트를 통해 서드파티 스크립트의 로딩 시점과 전략을 제어할 수 있습니다.
    -   **Code Splitting**: 페이지별로 코드를 자동으로 분할하여, 현재 페이지에 필요한 최소한의 코드만 로드합니다.

5.  **API Routes (API 라우트)**
    -   Next.js 애플리케이션 내에서 별도의 백엔드 서버 없이 간단하게 API 엔드포인트를 구축할 수 있는 기능을 제공합니다.

## Why use Next.js?

-   **성능**: SSG, SSR, ISR, 이미지 최적화 등 다양한 기능을 통해 뛰어난 웹 성능을 제공합니다.
-   **개발자 경험 (DX)**: 파일 시스템 라우팅, 빠른 새로고침(Fast Refresh), TypeScript 기본 지원 등 개발을 즐겁고 효율적으로 만들어주는 기능들이 많습니다.
-   **SEO (검색 엔진 최적화)**: 서버에서 페이지를 렌더링하므로 검색 엔진 크롤러가 컨텐츠를 쉽게 수집할 수 있어 SEO에 매우 유리합니다.
-   **풀스택 개발**: 프론트엔드와 백엔드(API Routes)를 하나의 프로젝트에서 동시에 개발할 수 있습니다.

Next.js는 단순한 웹사이트부터 복잡한 대규모 웹 애플리케이션까지, 모든 종류의 프로젝트를 위한 강력하고 유연한 솔루션을 제공하는 React의 슈퍼셋(superset)이라고 할 수 있습니다.
