# Nest.js with TypeScript

Nest.js는 TypeScript를 기반으로 만들어졌으며, TypeScript의 기능을 최대한 활용하여 안정적이고 유지보수하기 좋은 코드를 작성하도록 권장합니다.

## 1. TypeScript First

Nest.js는 처음부터 TypeScript를 염두에 두고 설계되었습니다.

-   **정적 타입**: 컴파일 시점에 타입 오류를 잡아내어 런타임 에러를 줄입니다.
-   **최신 JavaScript 기능**: ES6, ES7+의 최신 문법(e.g., `async/await`, `decorators`)을 사용할 수 있습니다.
-   **향상된 개발자 경험**: 코드 자동 완성, 리팩토링, 타입 추론 등 IDE의 지원을 최대한 활용할 수 있습니다.

## 2. DTO (Data Transfer Object)

DTO는 계층 간 데이터 전송을 위해 사용되는 객체입니다. Nest.js에서는 주로 클라이언트의 요청 본문(request body)이나 응답(response)의 형태를 정의하는 데 사용됩니다.

-   **역할**:
    -   요청 데이터의 형태(shape)를 명확하게 정의합니다.
    -   `ValidationPipe`와 함께 사용하여 들어오는 데이터의 유효성을 쉽게 검사할 수 있습니다.
    -   서비스나 데이터베이스 모델과 컨트롤러 계층을 분리하는 역할을 합니다.

### DTO와 `class-validator`

`class-validator`와 `class-transformer` 라이브러리를 사용하면 데코레이터 기반으로 DTO의 유효성 검사 규칙을 매우 쉽게 정의할 수 있습니다.

```typescript
// src/users/dto/create-user.dto.ts
import { IsString, IsEmail, IsInt, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsInt()
  @Min(0)
  @Max(150)
  readonly age: number;
}
```

### 컨트롤러에서 DTO 사용

컨트롤러의 핸들러 메서드에서 `@Body()` 데코레이터와 함께 DTO를 타입으로 지정하고, `@UsePipes(new ValidationPipe())`를 사용하여 유효성 검사를 자동으로 수행할 수 있습니다. (또는 `main.ts`에 전역 파이프로 설정)

```typescript
// src/users/users.controller.ts
import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true })) // DTO 유효성 검사 및 타입 변환
  async create(@Body() createUserDto: CreateUserDto) {
    this.usersService.create(createUserDto);
  }
}
```

## 3. 타입-세이프(Type-Safe) 프로바이더 주입

Nest.js의 의존성 주입 시스템은 TypeScript의 타입 시스템과 잘 통합됩니다. 생성자(constructor)에서 타입을 사용하여 프로바이더를 주입받으면, Nest가 해당 타입의 인스턴스를 자동으로 주입해줍니다.

```typescript
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // 타입으로 사용

@Injectable()
export class AuthService {
  // 생성자에서 UsersService 타입을 명시하여 의존성 주입
  constructor(private readonly usersService: UsersService) {}

  validateUser(username: string): boolean {
    const user = this.usersService.findOne(username);
    return !!user;
  }
}
```

이처럼 Nest.js는 TypeScript의 강력한 타입 시스템을 적극적으로 활용하여 개발자가 더 안정적이고 예측 가능한 코드를 작성하도록 돕습니다.
