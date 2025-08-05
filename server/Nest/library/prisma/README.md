# Prisma

- **카테고리**: ORM (Object-Relational Mapper)
- **설명**: Prisma는 차세대 Node.js 및 TypeScript ORM입니다. 전통적인 ORM과 달리, 데이터베이스 스키마를 단일 소스(single source of truth)로 사용하여 타입-세이프한 클라이언트(`PrismaClient`)를 자동으로 생성하는 것이 가장 큰 특징입니다. 이를 통해 데이터베이스와 상호작용하는 모든 코드가 완벽하게 타입-세이프해집니다.

## 핵심 특징

- **스키마 중심**: `schema.prisma`라는 직관적인 파일에 데이터베이스 모델, 관계, 속성을 정의합니다. 이 파일이 모든 것의 기준이 됩니다.
- **타입-세이프 클라이언트**: `prisma generate` 명령을 실행하면 `schema.prisma` 파일을 기반으로 데이터베이스의 모든 테이블과 관계를 이해하는 `PrismaClient`가 생성됩니다.
- **강력한 자동 완성**: 쿼리를 작성할 때 모델, 필드, 연산자 등이 자동으로 완성되어 생산성이 매우 높습니다.
- **마이그레이션 시스템**: `prisma migrate` 명령을 통해 스키마 변경사항을 추적하고 데이터베이스 마이그레이션을 안전하게 관리할 수 있습니다.
- **Prisma Studio**: 데이터베이스의 데이터를 시각적으로 탐색하고 편집할 수 있는 GUI 도구를 제공합니다.

## 기본 사용법

1.  **스키마 정의**: `schema.prisma` 파일에 데이터베이스 모델을 정의합니다.

    ```prisma
    // schema.prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    generator client {
      provider = "prisma-client-js"
    }

    model User {
      id    Int     @id @default(autoincrement())
      email String  @unique
      name  String?
      posts Post[]
    }

    model Post {
      id        Int      @id @default(autoincrement())
      title     String
      content   String?
      published Boolean  @default(false)
      author    User     @relation(fields: [authorId], references: [id])
      authorId  Int
    }
    ```

2.  **클라이언트 생성 및 마이그레이션**: CLI 명령을 실행하여 Prisma Client를 생성하고 데이터베이스 스키마를 동기화합니다.

    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

3.  **Nest.js 서비스에서 사용**: `PrismaService`를 만들어 애플리케이션 전체에서 `PrismaClient` 인스턴스를 공유하고, 이를 다른 서비스에 주입하여 사용합니다.

    ```typescript
    // prisma.service.ts
    import { Injectable, OnModuleInit } from '@nestjs/common';
    import { PrismaClient } from '@prisma/client';

    @Injectable()
    export class PrismaService extends PrismaClient implements OnModuleInit {
      async onModuleInit() {
        await this.$connect();
      }
    }

    // users.service.ts
    import { Injectable } from '@nestjs/common';
    import { PrismaService } from '../prisma/prisma.service';

    @Injectable()
    export class UsersService {
      constructor(private prisma: PrismaService) {}

      async findOne(email: string) {
        // 모든 쿼리가 완벽하게 타입-세이프함
        return this.prisma.user.findUnique({
          where: { email },
          include: { posts: true }, // 관계(relation) 쿼리
        });
      }
    }
    ```
