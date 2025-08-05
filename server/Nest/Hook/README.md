# Nest.js Lifecycle Events (Hooks)

Nest.js에서 "Hook"이라는 용어는 React처럼 직접적으로 사용되지는 않지만, 애플리케이션, 커넥션, 모듈, 프로바이더의 생명주기(Lifecycle) 동안 특정 시점에 트리거되는 **생명주기 이벤트(Lifecycle Events)** 가 그와 유사한 역할을 합니다. 이러한 이벤트를 "훅"하여 특정 로직을 실행할 수 있습니다.

## 1. Application Lifecycle

애플리케이션 전체의 생명주기와 관련된 이벤트입니다. `main.ts` 파일에서 `app` 인스턴스를 통해 사용하거나, `OnApplicationBootstrap`, `OnApplicationShutdown` 인터페이스를 구현하여 사용합니다.

-   **`onModuleInit`**: 호스트 모듈이 의존성을 모두 해결하고 초기화된 후에 한 번 호출됩니다. (`OnModuleInit` 인터페이스)
-   **`onApplicationBootstrap`**: 애플리케이션이 완전히 시작되고 모든 모듈이 초기화된 후에 호출됩니다. (`OnApplicationBootstrap` 인터페이스)
-   **`onModuleDestroy`**: 모듈이 파괴되기 직전에 호출됩니다. (`OnModuleDestroy` 인터페이스)
-   **`beforeApplicationShutdown`**: `app.close()`가 호출된 후, 애플리케이션 종료 프로세스가 시작될 때 호출됩니다. (`OnApplicationShutdown` 인터페이스)
-   **`onApplicationShutdown`**: 모든 커넥션이 닫힌 후, 애플리케이션이 종료되기 직전에 호출됩니다. (`OnApplicationShutdown` 인터페이스)

### 예제: `OnApplicationBootstrap`

```typescript
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class MyService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log('Application has successfully started!');
    // 애플리케이션 시작 시 실행할 초기화 로직 (e.g., 데이터베이스 시딩)
  }
}
```

## 2. Connection Lifecycle

WebSocket 게이트웨이나 마이크로서비스 등 지속적인 연결이 필요한 경우, 연결 및 해제와 관련된 생명주기 이벤트를 처리할 수 있습니다.

-   **`OnGatewayInit`**: 게이트웨이가 초기화된 후.
-   **`OnGatewayConnection`**: 클라이언트가 연결되었을 때.
-   **`OnGatewayDisconnect`**: 클라이언트 연결이 끊어졌을 때.

### 예제: `OnGatewayConnection`

```typescript
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
```

## 3. Request Lifecycle

모든 들어오는 요청은 다음과 같은 순서로 처리됩니다. 이 과정에서 미들웨어, 가드, 인터셉터, 파이프 등이 "훅"처럼 동작하여 요청-응답 사이클에 관여합니다.

1.  **Middleware** (미들웨어)
2.  **Guards** (가드)
3.  **Interceptors (before)** (인터셉터 - 전처리)
4.  **Pipes** (파이프)
5.  **Controller** (컨트롤러 핸들러)
6.  **Interceptors (after)** (인터셉터 - 후처리)
7.  **Exception filters** (예외 필터)

이러한 구성 요소들은 Nest.js에서 React의 Hooks와는 다른 방식으로, 특정 목적을 위해 요청 처리 흐름에 개입하는 강력한 메커니즘을 제공합니다.
