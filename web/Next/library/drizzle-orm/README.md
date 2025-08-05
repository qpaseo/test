# Drizzle ORM

- **카테고리**: ORM (Object-Relational Mapper)
- **설명**: Drizzle은 타입스크립트를 위해 만들어진 "헤드리스(headless)" ORM입니다. 전통적인 ORM과 달리, SQL에 가까운 구문을 사용하면서도 완전한 타입 안정성을 제공하는 것이 특징입니다. 데이터베이스 스키마를 기반으로 타입을 생성하여, 쿼리 작성 시 모든 테이블, 컬럼, 관계에 대해 자동 완성과 타입 검사를 지원합니다.

## 핵심 특징

- **타입 안정성 (Type-Safety)**: 데이터베이스 스키마를 변경하면, 관련된 모든 쿼리에서 타입 에러가 발생하여 실수를 방지합니다.
- **SQL-like 쿼리**: `SELECT`, `INSERT`, `UPDATE`, `JOIN` 등 SQL 구문과 매우 유사한 방식으로 쿼리를 작성하여, 기존 SQL 지식을 활용하기 쉽고 복잡한 쿼리도 직관적으로 작성할 수 있습니다.
- **성능**: 필요한 만큼의 가벼운 추상화만 제공하여 런타임 오버헤드가 매우 적습니다.
- **Drizzle Kit**: 데이터베이스 스키마를 관리하고 마이그레이션 파일을 생성하는 CLI 도구를 제공합니다.
- **다양한 DB 지원**: PostgreSQL, MySQL, SQLite 등 다양한 관계형 데이터베이스를 지원하며, 서버리스 환경에서도 잘 동작합니다.

## 기본 사용법

1.  **스키마 정의**: TypeScript 파일을 사용하여 데이터베이스 테이블 스키마를 정의합니다.

    ```typescript
    // db/schema.ts
    import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

    export const users = pgTable('users', {
      id: serial('id').primaryKey(),
      fullName: text('full_name'),
      email: varchar('email', { length: 256 }).notNull(),
    });

    export const posts = pgTable('posts', {
      id: serial('id').primaryKey(),
      title: text('title'),
      userId: serial('user_id').references(() => users.id),
    });
    ```

2.  **Drizzle Kit으로 마이그레이션 생성**: CLI를 사용하여 스키마 변경사항을 기반으로 SQL 마이그레이션 파일을 생성하고 데이터베이스에 적용합니다.

    ```bash
    npx drizzle-kit generate:pg # 마이그레이션 파일 생성
    npx drizzle-kit migrate      # DB에 마이그레이션 적용
    ```

3.  **쿼리 작성**: 생성된 타입을 기반으로 타입-세이프한 쿼리를 작성합니다.

    ```typescript
    // lib/db.ts
    import { drizzle } from 'drizzle-orm/node-postgres';
    import { Client } from 'pg';
    import * as schema from './schema';

    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    export const db = drizzle(client, { schema });

    // --- 쿼리 예시 ---
    async function getUsers() {
      // `db.query.users`의 모든 필드와 관계가 타입-세이프하게 자동 완성됨
      const allUsers = await db.query.users.findMany({
        with: {
          posts: true, // 관계(relation) 쿼리
        },
      });
      return allUsers;
    }

    async function insertUser(email: string) {
      // `values` 객체의 필드도 타입 검사가 이루어짐
      const newUser = await db.insert(schema.users).values({ email }).returning();
      return newUser[0];
    }
    ```
