# Nest.js Server Communication

Nest.js 애플리케이션은 그 자체가 서버이지만, 다른 백엔드 서비스(마이크로서비스, 외부 API 등)나 데이터베이스와 통신해야 하는 경우가 많습니다.

## 1. 데이터베이스(Database) 연동

Nest.js는 특정 데이터베이스 기술에 종속되지 않으며, 다양한 데이터베이스와 쉽게 통합할 수 있습니다. 주로 ORM(Object-Relational Mapping) 라이브러리를 사용하여 데이터베이스와 상호작용합니다.

### TypeORM

-   **설명**: TypeScript와 JavaScript를 위한 가장 성숙한 ORM 중 하나입니다. Nest.js와 매우 잘 통합되며 공식 문서에서도 주요하게 다룹니다.
-   **설정**: `@nestjs/typeorm` 패키지를 설치하고, `TypeOrmModule`을 사용하여 데이터베이스 연결을 설정하고, 리포지토리(Repository)를 주입하여 사용합니다.

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'test',
      entities: [User],
      synchronize: true, // 개발 환경에서만 true로 설정
    }),
  ],
})
export class AppModule {}
```

```typescript
// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
```

### 기타 ORM/ODM

-   **Prisma**: 차세대 ORM으로, 타입-세이프(type-safe)한 데이터베이스 접근과 자동 생성되는 쿼리 빌더로 인기가 높습니다.
-   **Mongoose**: MongoDB(NoSQL 데이터베이스)를 위한 ODM(Object-Document Mapper)으로, `@nestjs/mongoose` 패키지를 통해 쉽게 통합할 수 있습니다.

## 2. 외부 API 통신 (`HttpModule`)

Nest.js는 외부 HTTP API와 통신하기 위해 `axios`를 기반으로 한 `@nestjs/axios` 패키지의 `HttpModule`을 제공합니다.

-   `HttpService`를 프로바이더에 주입하여 `GET`, `POST` 등 HTTP 요청을 보낼 수 있습니다.
-   RxJS의 `Observable`을 반환하므로, `firstValueFrom` 또는 `lastValueFrom`을 사용하여 `Promise`로 변환하여 사용할 수 있습니다.

```typescript
// posts.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PostsService {
  constructor(private readonly httpService: HttpService) {}

  async findAllFromExternalApi(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://jsonplaceholder.typicode.com/posts'),
    );
    return data;
  }
}
```

## 3. 마이크로서비스(Microservices)

Nest.js는 마이크로서비스 아키텍처를 구축하기 위한 강력한 기능을 내장하고 있습니다. 여러 개의 독립적인 서비스가 서로 통신하며 하나의 큰 애플리케이션처럼 동작하게 만들 수 있습니다.

-   **전송 계층(Transporters)**: TCP, Redis, gRPC, Kafka, NATS 등 다양한 통신 프로토콜을 지원합니다.
-   **통신 패턴**: 요청-응답(request-response) 방식과 이벤트 기반(event-based) 메시징을 모두 지원합니다.
-   `ClientsModule`을 사용하여 다른 마이크로서비스에 요청을 보내거나 이벤트를 발행할 수 있습니다.
