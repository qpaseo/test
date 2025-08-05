# Nest.js Sundry (기타 주요 기능)

이 문서에서는 Nest.js의 핵심 구성 요소 외에, 요청-응답 사이클에 관여하여 애플리케이션의 기능을 풍부하게 만드는 여러 빌딩 블록들을 설명합니다.

## 1. Pipes (`@UsePipes`)

파이프는 라우트 핸들러로 전달되는 인자(argument)에 대해 **데이터 변환(transformation)** 과 **유효성 검사(validation)** 를 수행하는 클래스입니다. `@Injectable()` 데코레이터로 주석이 달려 있습니다.

-   **변환**: 입력 데이터를 원하는 형식으로 변환합니다 (e.g., 문자열을 숫자로).
-   **유효성 검사**: 입력 데이터가 유효하지 않으면 예외를 발생시킵니다.

Nest.js는 `ValidationPipe`, `ParseIntPipe` 등 여러 내장 파이프를 제공합니다. `class-validator`와 `class-transformer` 라이브러리를 함께 사용하면 DTO에 대한 유효성 검사를 매우 효율적으로 수행할 수 있습니다.

```typescript
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('items')
export class ItemsController {
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // id는 이제 number 타입임이 보장됩니다.
    return `Item with id: ${id}`;
  }
}
```

## 2. Guards (`@UseGuards`)

가드는 특정 조건(e.g., 권한, 역할)에 따라 현재 요청을 처리할지 여부를 결정하는 클래스입니다. 주로 **인증(Authentication)** 및 **인가(Authorization)** 를 구현하는 데 사용됩니다.

-   `canActivate` 메서드를 구현하며, `true`를 반환하면 요청이 처리되고 `false`를 반환하면 요청이 거부됩니다.

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // 여기에 인증 로직을 구현 (e.g., request.user가 있는지 확인)
    return true; // 또는 false
  }
}

// 사용법: @UseGuards(AuthGuard)
```

## 3. Interceptors (`@UseInterceptors`)

인터셉터는 라우트 핸들러의 **실행 전후**에 추가적인 로직을 "가로채서" 실행할 수 있는 기능을 제공합니다. AOP(Aspect-Oriented Programming)에서 영감을 받았습니다.

-   **주요 사용 사례**:
    -   메서드 실행 전후에 로깅
    -   예외를 매핑하거나 처리
    -   응답 데이터의 형식을 변환
    -   캐싱 처리

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...'); // 핸들러 실행 전

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)), // 핸들러 실행 후
      );
  }
}
```

## 4. Exception Filters (`@Catch`)

예외 필터는 애플리케이션 전체에서 처리되지 않은 모든 예외를 잡아내어, 클라이언트에게 적절한 형식의 응답을 보내주는 역할을 합니다.

-   `@Catch(HttpException)`와 같이 특정 타입의 예외만 잡거나, `@Catch()`로 모든 예외를 잡을 수 있습니다.
-   로깅, 에러 리포팅 등 예외 상황에 대한 중앙 집중식 처리를 가능하게 합니다.

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```
