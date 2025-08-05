# Nest.js Summary

## What is Nest.js?

Nest.js는 효율적이고, 안정적이며, 확장 가능한 **서버-사이드 애플리케이션(Server-Side Applications)** 을 구축하기 위한 프로그레시브(Progressive) Node.js 프레임워크입니다. TypeScript를 완벽하게 지원하며, 객체 지향 프로그래밍(OOP), 함수형 프로그래밍(FP), 함수형 반응형 프로그래밍(FRP)의 요소를 결합합니다.

내부적으로는 Express.js(기본값)나 Fastify와 같은 강력한 HTTP 서버 프레임워크를 사용하면서, 개발자가 아키텍처를 쉽게 구성할 수 있도록 추상화 계층을 제공합니다.

## Core Philosophy & Concepts

1.  **Modular Architecture (모듈식 아키텍처)**
    -   애플리케이션을 **모듈(Module)** 단위로 구성하여 코드를 체계적으로 관리합니다. 각 모듈은 관련된 기능(컨트롤러, 서비스 등)을 캡슐화하여 강력한 결합(high cohesion)과 느슨한 결합(low coupling)을 지향합니다.

2.  **Dependency Injection (의존성 주입)**
    -   Nest.js의 핵심 원칙으로, 클래스 간의 의존성을 프레임워크가 관리하고 주입해주는 디자인 패턴입니다. 이를 통해 코드의 재사용성과 테스트 용이성이 크게 향상됩니다.
    -   **프로바이더(Provider)** (주로 서비스)는 `@Injectable()` 데코레이터로 정의되고, 생성자(constructor)를 통해 다른 클래스에 주입됩니다.

3.  **Decorators (데코레이터)**
    -   TypeScript의 데코레이터 기능을 적극적으로 사용하여 코드의 가독성을 높이고, 선언적인 방식으로 클래스와 그 멤버에 메타데이터를 추가합니다.
    -   `@Module()`, `@Controller()`, `@Injectable()`, `@Get()`, `@Post()` 등 거의 모든 핵심 기능이 데코레이터를 통해 구현됩니다.

4.  **Platform Agnostic (플랫폼 독립성)**
    -   Nest.js는 특정 플랫폼에 종속되지 않습니다. 기본적으로 HTTP 서버 애플리케이션을 만들지만, 마이크로서비스, WebSocket, GraphQL, CLI 등 다양한 종류의 애플리케이션을 동일한 아키텍처 위에서 구축할 수 있습니다.

## Key Building Blocks

-   **Controllers**: 들어오는 요청을 받고 응답을 반환하는 역할. 라우팅을 담당합니다.
-   **Providers (Services)**: 비즈니스 로직을 처리하는 역할. 컨트롤러나 다른 서비스에 주입되어 사용됩니다.
-   **Modules**: 컨트롤러와 프로바이더를 그룹화하여 애플리케이션 구조를 구성합니다.
-   **Pipes**: 데이터 변환(transformation) 및 유효성 검사(validation)를 처리합니다.
-   **Guards**: 인증(Authentication) 및 인가(Authorization)와 같은 권한을 처리합니다.
-   **Interceptors**: 메서드 실행 전후에 추가 로직(로깅, 응답 매핑 등)을 바인딩합니다.
-   **Exception Filters**: 처리되지 않은 예외를 잡아 적절한 응답을 생성합니다.

## Why use Nest.js?

-   **구조화된 아키텍처**: 대규모 애플리케이션도 체계적으로 관리할 수 있는 강력한 아키텍처를 제공합니다.
-   **TypeScript 지원**: 정적 타입을 통해 코드의 안정성과 생산성을 높입니다.
-   **테스트 용이성**: 의존성 주입을 기반으로 하여 단위 테스트 및 E2E 테스트 작성이 용이합니다.
-   **확장성**: 모듈식 구조와 다양한 빌딩 블록을 통해 기능을 쉽게 확장하고 재사용할 수 있습니다.
-   **풍부한 생태계**: 데이터베이스, 인증, 캐싱, 설정 등 다양한 공식 모듈을 제공하여 개발을 가속화합니다.
