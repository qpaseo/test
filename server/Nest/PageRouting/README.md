# Nest.js Routing (Controllers)

Nest.js는 백엔드 프레임워크이므로 '페이지'를 라우팅하는 것이 아니라, 들어오는 HTTP 요청을 어떤 로직으로 처리할지 결정하는 **엔드포인트(Endpoint) 라우팅**을 수행합니다. 이 역할은 **컨트롤러(Controller)** 가 담당합니다.

## 1. 컨트롤러와 라우팅

컨트롤러는 `@Controller()` 데코레이터를 사용하여 정의됩니다. 이 데코레이터에 전달되는 문자열은 해당 컨트롤러 내의 모든 라우트(엔드포인트)에 대한 기본 경로 접두사(prefix)가 됩니다.

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('users') // 이 컨트롤러의 모든 경로는 '/users'로 시작합니다.
export class UsersController {
  // ...
}
```

## 2. 라우트 핸들러 (Route Handlers)

컨트롤러 클래스 내의 메서드는 `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()` 등과 같은 HTTP 요청 메서드 데코레이터를 사용하여 특정 요청을 처리하는 핸들러가 됩니다.

-   `@Get()`: GET 요청을 처리합니다.
-   `@Post()`: POST 요청을 처리합니다.
-   `@Put()`: PUT 요청을 처리합니다.
-   `@Delete()`: DELETE 요청을 처리합니다.

```typescript
@Controller('users')
export class UsersController {
  @Get() // GET /users
  findAll(): string {
    return 'This action returns all users';
  }

  @Post() // POST /users
  create(): string {
    return 'This action adds a new user';
  }

  @Get('profile') // GET /users/profile
  findProfile(): string {
    return 'This action returns a user profile';
  }
}
```

## 3. 동적 라우팅 (Route Parameters)

URL 경로의 일부를 변수로 사용하여 동적인 값을 받으려면 라우트 파라미터를 사용합니다. 경로에 콜론(`:`)을 사용하여 파라미터를 정의하고, `@Param()` 데코레이터를 사용하여 메서드 내에서 해당 값을 가져옵니다.

```typescript
@Controller('users')
export class UsersController {
  @Get(':id') // e.g., GET /users/123
  findOne(@Param('id') id: string): string {
    return `This action returns user #${id}`;
  }
}
```

## 4. 쿼리 파라미터 (Query Parameters)

URL의 쿼리 문자열(e.g., `?role=admin&limit=10`)에서 값을 가져오려면 `@Query()` 데코레이터를 사용합니다.

```typescript
@Controller('users')
export class UsersController {
  @Get() // e.g., GET /users?role=admin
  findByRole(@Query('role') role: string) {
    return `This action returns users with role: ${role}`;
  }
}
```

## 5. 요청 본문 (Request Body)

POST나 PUT 요청 등에서 클라이언트가 전송한 데이터를 받으려면 `@Body()` 데코레이터를 사용합니다. 일반적으로 DTO(Data Transfer Object)와 함께 사용됩니다.

```typescript
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'This action creates a user with the provided data.';
  }
}
```
