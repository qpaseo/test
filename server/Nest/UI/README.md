# Nest.js and UI

Nest.js는 **백엔드 프레임워크**이므로 직접적으로 사용자 인터페이스(UI)를 렌더링하는 기능은 핵심 역할이 아닙니다. Nest.js의 주된 목적은 API 엔드포인트, 비즈니스 로직, 데이터베이스 연동 등 서버 측 로직을 구축하는 것입니다.

하지만 Nest.js 애플리케이션은 다양한 방식으로 프론트엔드 UI와 함께 작동할 수 있습니다.

## 1. Headless API 서버 (일반적인 방식)

가장 일반적인 아키텍처는 Nest.js를 **Headless API 서버**로 사용하는 것입니다.

-   Nest.js는 JSON 형태의 데이터를 제공하는 RESTful API 또는 GraphQL API를 구축합니다.
-   프론트엔드(React, Next.js, Vue, Angular 등)는 완전히 분리된 프로젝트로 개발되며, HTTP 요청을 통해 Nest.js API와 통신하여 데이터를 주고받습니다.
-   이 방식은 프론트엔드와 백엔드의 역할을 명확하게 분리하여 개발 및 배포를 독립적으로 할 수 있게 해주는 장점이 있습니다.

```
+-----------------+      (HTTP/GraphQL)      +------------------------+
|                 | <----------------------> |                        |
|  Frontend App   |                          |      Nest.js API       |
| (React, Next.js)|      API Requests        | (Controllers, Services)|
|                 |                          |                        |
+-----------------+                          +------------------------+
```

## 2. 정적 파일 서빙 (Serving Static Assets)

Nest.js는 빌드된 프론트엔드 애플리케이션(e.g., `npm run build`로 생성된 React의 `build` 폴더)의 정적 파일(HTML, CSS, JS)을 직접 서빙할 수 있습니다.

-   `@nestjs/serve-static` 패키지를 사용하여 특정 폴더를 정적 에셋 경로로 지정할 수 있습니다.
-   이 방식은 프론트엔드와 백엔드를 하나의 서버에서 함께 호스팅해야 할 때 유용합니다.

### 예제 설정

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // '../client/build'는 React 앱의 빌드 결과물이 있는 경로
      rootPath: join(__dirname, '..', 'client/build'),
    }),
  ],
})
export class AppModule {}
```

## 3. 서버 사이드 렌더링 (SSR) 및 템플릿 엔진

Nest.js는 전통적인 서버 사이드 렌더링(SSR)을 위해 템플릿 엔진을 통합할 수 있습니다.

-   Express.js의 기능을 활용하여 `Pug`, `Handlebars`, `EJS` 등의 템플릿 엔진을 설정할 수 있습니다.
-   컨트롤러에서 `res.render()` 메서드를 호출하여 동적인 데이터를 포함한 HTML 페이지를 렌더링하고 클라이언트에 반환할 수 있습니다.
-   이 방식은 간단한 웹 페이지나 관리자 대시보드를 만들 때 사용될 수 있지만, 복잡한 UI에는 React나 Vue와 같은 현대적인 프론트엔드 프레임워크를 사용하는 것이 일반적입니다.

### 예제: Express와 Handlebars 사용

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'main' }));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
```
