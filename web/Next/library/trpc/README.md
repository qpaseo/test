# tRPC (TypeScript Remote Procedure Call)

- **카테고리**: API 구축 (API Construction)
- **설명**: tRPC는 스키마나 코드 생성 없이 완전한 타입-세이프(end-to-end typesafe) API를 구축할 수 있게 해주는 라이브러리입니다. 백엔드(서버)에서 정의한 API 라우터의 타입 정보를 프론트엔드(클라이언트)에서 그대로 추론하여 사용하므로, API 명세가 변경되면 클라이언트 코드에서 즉시 타입 에러가 발생합니다. 이를 통해 API 연동 과정에서의 실수를 원천적으로 방지할 수 있습니다.

## 핵심 특징

- **End-to-End 타입 안정성**: 백엔드와 프론트엔드 간의 타입이 자동으로 공유되고 검사됩니다. API 문서를 보거나, 타입을 수동으로 맞출 필요가 없습니다.
- **스키마 불필요**: OpenAPI/GraphQL과 같은 API 스키마를 별도로 정의할 필요가 없습니다. TypeScript 코드 자체가 API의 명세가 됩니다.
- **간편한 설정**: 기존 Next.js 프로젝트에 비교적 쉽게 통합할 수 있습니다.
- **자동 완성**: 프론트엔드에서 API를 호출할 때, 사용 가능한 프로시저(procedure)와 입력(input)/출력(output) 타입이 자동으로 완성됩니다.
- **`react-query` 통합**: `@trpc/react-query` 패키지를 통해 TanStack Query(React Query)와 완벽하게 통합되어, 타입-세이프한 데이터 페칭, 캐싱, 뮤테이션을 매우 쉽게 구현할 수 있습니다.

## 기본 흐름

1.  **백엔드에서 라우터 정의**: Zod와 같은 유효성 검사 라이브러리를 사용하여 입력값의 타입을 정의하고, API 프로시저(쿼리, 뮤테이션)를 만듭니다.

    ```typescript
    // server/trpc/routers/app.ts
    import { z } from 'zod';
    import { publicProcedure, router } from '../trpc';

    export const appRouter = router({
      getUser: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(({ input }) => {
          // 데이터베이스에서 사용자 조회
          return { id: input.userId, name: 'John Doe' };
        }),
      createUser: publicProcedure
        .input(z.object({ name: z.string() }))
        .mutation(({ input }) => {
          // 데이터베이스에 사용자 생성
          return { id: '123', name: input.name };
        }),
    });

    export type AppRouter = typeof appRouter;
    ```

2.  **Next.js API 라우트 설정**: tRPC 라우터를 처리하는 Next.js API 핸들러를 만듭니다.

3.  **프론트엔드에서 tRPC 클라이언트 설정**: tRPC 클라이언트를 설정하고, 백엔드 라우터의 타입을 `AppRouter`로 지정합니다.

4.  **프론트엔드에서 API 호출**: 생성된 tRPC 클라이언트를 사용하여 백엔드 API를 마치 일반적인 TypeScript 함수처럼 호출합니다.

    ```tsx
    // client/components/UserInfo.tsx
    import { trpc } from '../utils/trpc';

    function UserInfo({ userId }: { userId: string }) {
      // `useQuery` 훅을 사용하여 데이터 페칭
      // 입력값과 반환값 모두 완벽하게 타입이 추론됨
      const { data, isLoading } = trpc.getUser.useQuery({ userId });

      if (isLoading) return <div>Loading...</div>;

      return <div>User: {data?.name}</div>;
    }
    ```
