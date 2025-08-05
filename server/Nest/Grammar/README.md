# Nest.js Grammar

Nest.js는 TypeScript를 기반으로 하며, 제어의 역전(IoC), 의존성 주입(DI) 등 객체 지향 프로그래밍과 함수형 프로그래밍의 요소를 결합한 아키텍처를 가지고 있습니다. 핵심 구성 요소는 데코레이터(Decorator)를 통해 정의됩니다.

## 1. Modules (`@Module`)

모듈은 애플리케이션 구조를 구성하는 기본 단위입니다. `@Module()` 데코레이터로 주석이 달린 클래스이며, 관련된 컨트롤러, 프로바이더 등을 그룹화합니다.

-   **`providers`**: Nest의 의존성 주입기(Injector)에 의해 인스턴스화되고 이 모듈 내에서 공유될 수 있는 프로바이더(서비스) 목록.
-   **`controllers`**: 이 모듈에 정의된 컨트롤러 집합.
-   **`imports`**: 이 모듈에서 필요한 프로바이더를 내보내는(export) 다른 모듈의 목록.
-   **`exports`**: 이 모듈에서 제공하는 프로바이더 중 다른 모듈에서 사용할 수 있도록 공개할 프로바이더의 목록.

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 2. Controllers (`@Controller`)

컨트롤러는 들어오는 **요청(request)을 처리**하고 **응답(response)을 반환**하는 역할을 합니다. 라우팅 메커니즘을 제어하여 특정 요청을 적절한 핸들러 함수에 매핑합니다.

-   `@Controller('path')` 데코레이터는 컨트롤러의 기본 경로를 정의합니다.
-   `@Get()`, `@Post()`, `@Put()`, `@Delete()` 등과 같은 HTTP 요청 메서드 데코레이터를 사용하여 특정 엔드포인트를 만듭니다.

```typescript
// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app') // 기본 경로: /app
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello') // GET /app/hello
  getHello(): string {
    return this.appService.getHello();
  }
}
```

## 3. Providers (`@Injectable`)

프로바이더는 Nest의 핵심 개념으로, 서비스(Service), 리포지토리(Repository), 팩토리(Factory), 헬퍼(Helper) 등 다양한 역할을 수행할 수 있습니다. 주요 아이디어는 **의존성으로 주입(inject)**될 수 있다는 것입니다.

-   `@Injectable()` 데코레이터는 해당 클래스가 Nest IoC 컨테이너에 의해 관리될 수 있음을 나타냅니다.
-   주로 비즈니스 로직을 처리하며, 컨트롤러는 이 서비스를 주입받아 사용합니다.

```typescript
// src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

이 세 가지 구성 요소(모듈, 컨트롤러, 프로바이더)는 Nest.js 애플리케이션의 기본적인 뼈대를 이룹니다.
