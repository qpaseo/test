# Nest.js: Official & Built-in Libraries

이 문서는 Nest.js 프레임워크에서 공식적으로 제공하거나 핵심 생태계를 구성하는 주요 모듈 및 라이브러리를 설명합니다. 이들은 Nest.js의 아키텍처와 완벽하게 통합되도록 설계되었습니다.

## 1. `@nestjs/config`

-   **카테고리**: 설정 관리 (Configuration)
-   **설명**: 애플리케이션의 환경 변수를 관리하기 위한 모듈입니다. `.env` 파일을 사용하여 환경별(개발, 프로덕션, 테스트 등) 설정을 쉽게 관리하고, `ConfigService`를 통해 애플리케이션 전체에서 타입-세이프하게 설정 값에 접근할 수 있습니다.

## 2. `@nestjs/passport` & `@nestjs/jwt`

-   **카테고리**: 인증 (Authentication)
-   **설명**: `passport` 라이브러리를 Nest.js에 통합하여 유연하고 확장 가능한 인증 메커니즘을 구현합니다. `@nestjs/jwt`는 JWT(JSON Web Token)를 생성하고 검증하는 기능을 제공하며, `passport-jwt` 전략과 함께 사용하여 토큰 기반 인증을 쉽게 구현할 수 있습니다.

## 3. `@nestjs/typeorm`

-   **카테고리**: 데이터베이스, ORM
-   **설명**: TypeScript를 위한 인기 ORM인 `TypeORM`을 Nest.js와 완벽하게 통합해주는 모듈입니다. `TypeOrmModule`을 통해 데이터베이스 연결을 설정하고, `@InjectRepository()` 데코레이터를 사용하여 서비스(Service) 계층에 리포지토리(Repository)를 쉽게 주입할 수 있습니다.

## 4. `@nestjs/swagger`

-   **카테고리**: API 문서화 (API Documentation)
-   **설명**: OpenAPI (구 Swagger) 명세를 자동으로 생성하여 API 문서를 만들어주는 모듈입니다. 컨트롤러, DTO의 데코레이터와 타입 정보를 분석하여, 별도의 작업 없이도 대화형 API 문서를 자동으로 생성하고 UI로 제공합니다.

## 5. `class-validator` & `class-transformer`

-   **카테고리**: 유효성 검사 및 데이터 변환 (Validation & Transformation)
-   **설명**: Nest.js 생태계의 핵심 라이브러리로, 데코레이터 기반으로 DTO(Data Transfer Object)의 유효성을 검사하고, 들어오는 데이터를 원하는 타입으로 변환하는 역할을 합니다. Nest.js의 내장 `ValidationPipe`가 이 두 라이브러리를 사용하여 강력한 유효성 검사 기능을 제공합니다.

```typescript
// DTO 예시
import { IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  @Type(() => Number) // 들어온 데이터를 숫자로 변환
  price: number;
}
```
