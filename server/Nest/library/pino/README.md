# Pino

- **카테고리**: 로깅 (Logging)
- **설명**: Pino는 Node.js를 위한 고성능 로거(Logger) 라이브러리입니다. 가장 큰 특징은 **매우 빠르다**는 점으로, JSON 형식의 로그를 최소한의 오버헤드로 출력하는 데 중점을 둡니다. 프로덕션 환경에서 대량의 로그를 안정적으로 처리해야 할 때 훌륭한 선택입니다.

## 핵심 특징

- **성능**: 다른 로거 라이브러리에 비해 월등히 빠른 성능을 자랑합니다. 비동기 로깅을 통해 애플리케이션의 이벤트 루프를 거의 차단하지 않습니다.
- **JSON 기반 로깅**: 로그를 구조화된 JSON 형식으로 출력하여, Datadog, Splunk, Elasticsearch와 같은 로그 수집 및 분석 시스템과 쉽게 통합할 수 있습니다.
- **Child Loggers**: 기본 로거에 컨텍스트(e.g., `requestId`)를 추가한 자식 로거를 생성하여, 특정 요청이나 세션과 관련된 로그를 쉽게 추적할 수 있습니다.
- **Pretty Printing**: 개발 환경에서는 `pino-pretty`와 같은 전송(transport) 모듈을 사용하여 사람이 읽기 쉬운 형식으로 로그를 출력할 수 있습니다.
- **확장성**: 다양한 전송(transport) 모듈을 통해 로그를 파일, 데이터베이스, 외부 서비스 등 다양한 대상으로 보낼 수 있습니다.

## Nest.js와 함께 사용하기 (`nestjs-pino`)

`nestjs-pino` 라이브러리를 사용하면 Pino를 Nest.js 애플리케이션에 매우 쉽게 통합할 수 있습니다.

1.  **설치**: `nestjs-pino`와 `pino-http`, `pino-pretty`를 설치합니다.

2.  **모듈 설정**: `AppModule`에서 `LoggerModule`을 `forRoot` 또는 `forRootAsync`로 설정합니다.

    ```typescript
    // app.module.ts
    import { Module } from '@nestjs/common';
    import { LoggerModule } from 'nestjs-pino';

    @Module({
      imports: [
        LoggerModule.forRoot({
          pinoHttp: {
            // 개발 환경에서만 pretty print 사용
            transport:
              process.env.NODE_ENV !== 'production'
                ? {
                    target: 'pino-pretty',
                    options: {
                      singleLine: true,
                    },
                  }
                : undefined,
            level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
          },
        }),
      ],
    })
    export class AppModule {}
    ```

3.  **전역 로거로 사용**: `main.ts`에서 Nest.js의 기본 로거를 `nestjs-pino`의 로거로 교체합니다.

    ```typescript
    // main.ts
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import { Logger } from 'nestjs-pino';

    async function bootstrap() {
      const app = await NestFactory.create(AppModule, { bufferLogs: true });
      app.useLogger(app.get(Logger)); // Nest.js 기본 로거를 Pino로 교체
      await app.listen(3000);
    }
    bootstrap();
    ```

4.  **서비스에서 로깅**: 이제 컨트롤러나 서비스에서 `@InjectLogger()` 데코레이터나 `Logger` 클래스를 주입하여 로그를 남길 수 있습니다. `nestjs-pino`가 들어오는 모든 HTTP 요청에 대한 정보를 자동으로 로깅해줍니다.

    ```typescript
    // app.service.ts
    import { Injectable, Logger } from '@nestjs/common';

    @Injectable()
    export class AppService {
      private readonly logger = new Logger(AppService.name);

      getHello(): string {
        this.logger.log('getHello method called'); // INFO 레벨 로그
        this.logger.debug('This is a debug message'); // DEBUG 레벨 로그
        return 'Hello World!';
      }
    }
    ```
