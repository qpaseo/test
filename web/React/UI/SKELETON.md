# Skeleton UI (스켈레톤 UI)

스켈레톤 UI는 데이터가 로드되기 전에 페이지의 레이아웃과 구조를 미리 보여주는 UI 패턴입니다. 실제 컨텐츠가 렌더링될 자리에 회색이나 은은한 애니메이션이 적용된 플레이스홀더(placeholder)를 배치하여, 사용자가 컨텐츠가 로드되고 있음을 인지하고 로딩 상태를 더 쾌적하게 느끼도록 도와줍니다. 이는 빈 화면이나 로딩 스피너를 보여주는 것보다 훨씬 향상된 사용자 경험(UX)을 제공합니다.

## 왜 사용하는가?

-   **인지 성능 향상**: 사용자는 실제 로딩 시간이 줄어들지 않더라도, 무엇이 로드될지 예측할 수 있으므로 로딩이 더 빠르다고 느낍니다.
-   **컨텍스트 제공**: 빈 화면과 달리, 페이지의 구조를 미리 보여주므로 사용자는 기다리는 동안 어떤 내용이 나타날지 예상할 수 있습니다.
-   **레이아웃 쉬프트 방지**: 컨텐츠가 로드되면서 화면 요소들이 갑자기 나타나 레이아웃이 밀리는 현상(CLS, Cumulative Layout Shift)을 방지할 수 있습니다.

## `react-loading-skeleton` 라이브러리 사용법

`react-loading-skeleton`은 React에서 스켈레톤 UI를 매우 쉽게 구현할 수 있도록 도와주는 인기 있는 라이브러리입니다.

### 1. 설치

```bash
npm install react-loading-skeleton
```

### 2. 기본 사용법

먼저 스켈레톤 스타일을 적용하기 위해 CSS 파일을 임포트해야 합니다.

```jsx
// App.js 또는 최상위 컴포넌트
import 'react-loading-skeleton/dist/skeleton.css'
```

그 다음, `Skeleton` 컴포넌트를 사용하여 스켈레톤 UI를 구성합니다.

```jsx
import Skeleton from 'react-loading-skeleton';

function BlogPost() {
  return (
    <div>
      <h1><Skeleton /></h1>
      <p><Skeleton count={5} /></p> {/* 5줄의 스켈레톤 생성 */}
    </div>
  );
}
```

### 3. 로딩 상태와 결합하기

일반적으로 `isLoading`과 같은 상태 변수를 사용하여, 로딩 중일 때는 스켈레톤 UI를, 로딩이 완료되면 실제 데이터를 보여줍니다.

```jsx
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2초 후 데이터 로딩이 완료되었다고 가정
    setTimeout(() => {
      setUser({
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://via.placeholder.com/80'
      });
      setIsLoading(false);
    }, 2000);
  }, []);

  // 로딩 중일 때 보여줄 스켈레톤 컴포넌트
  const SkeletonCard = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Skeleton circle width={80} height={80} />
      <div style={{ marginLeft: '1rem', flex: 1 }}>
        <Skeleton height={30} width={`80%`} />
        <Skeleton width={`60%`} />
      </div>
    </div>
  );

  return (
    <div>
      {isLoading ? (
        <SkeletonCard />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={user.avatar} alt="User Avatar" style={{ borderRadius: '50%', width: 80, height: 80 }} />
          <div style={{ marginLeft: '1rem' }}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4. 테마 적용 (`SkeletonTheme`)

`SkeletonTheme` 프로바이더를 사용하면 애플리케이션 전체의 스켈레톤 색상, 애니메이션 등을 일관되게 설정할 수 있습니다.

```jsx
import { SkeletonTheme } from 'react-loading-skeleton';

function App() {
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      {/* 앱의 나머지 부분 */}
      <UserProfile />
    </SkeletonTheme>
  );
}
```
