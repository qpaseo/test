# 상태 관리 (React Hooks와 유사한 개념)

SwiftUI는 UI를 상태(State)의 함수로 보는 선언형 패러다임을 사용합니다. 이는 "UI = f(state)" 라는 공식으로 요약되며, React Hooks나 Jetpack Compose의 상태 관리 방식과 철학적으로 동일합니다. SwiftUI에서는 **프로퍼티 래퍼(Property Wrapper)** 라는 기능을 사용해 상태를 선언하고 UI에 연결합니다.

## `@State` (React의 `useState`와 유사)

`@State`는 View **내부**에서 사용되는 간단한 값(String, Int, Bool 등)의 상태를 저장하고 관찰하기 위해 사용됩니다. `@State`로 선언된 프로퍼티의 값이 변경되면, SwiftUI는 이를 감지하고 해당 프로퍼티를 사용하는 View의 `body`를 다시 계산하여 UI를 자동으로 업데이트합니다.

- **소유권**: `@State` 프로퍼티는 해당 View가 소유하고 관리합니다. View가 생성될 때 함께 생성되고, View가 사라질 때 함께 파괴됩니다.

**React `useState` 예시:**
```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      You've clicked me {count} times
    </button>
  );
}
```

**SwiftUI `@State` 예시:**
```swift
import SwiftUI

struct CounterView: View {
    // @State 프로퍼티는 보통 private으로 선언하여 View 외부에서의 접근을 막습니다.
    @State private var count = 0

    var body: some View {
        Button(action: {
            self.count += 1
        }) {
            // count 값이 바뀔 때마다 Text가 자동으로 업데이트됩니다.
            Text("You've clicked me \(count) times")
        }
    }
}
```

---

## `.task` Modifier (React의 `useEffect`와 유사)

View가 화면에 나타날 때 비동기 작업을 수행하고, View가 사라질 때 해당 작업을 자동으로 취소하고 싶을 때 `.task` 수식어(Modifier)를 사용합니다. 이는 Swift의 새로운 동시성(Concurrency) 모델인 `async/await`과 함께 사용됩니다.

- `.task(id: ...)`: `id`로 전달된 값이 변경될 때마다 기존 작업을 취소하고 새로운 비동기 작업을 시작합니다. React `useEffect`의 의존성 배열(`[value]`)과 동일한 역할을 합니다.
- `.task()`: `id` 없이 사용하면 View가 처음 나타날 때 **한 번만** 실행됩니다. (React `useEffect`의 `[]` 의존성 배열과 동일)

**React `useEffect` 예시:**
```jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // userId가 변경될 때마다 API를 호출합니다.
    fetchUser(userId).then(data => setUser(data));
  }, [userId]); // 의존성 배열

  if (!user) {
    return <div>Loading...</div>;
  }
  return <div>{user.name}</div>;
}
```

**SwiftUI `.task` 예시:**
```swift
import SwiftUI

// struct User: Codable { let name: String }
// func fetchUser(id: Int) async throws -> User { ... }

struct UserProfileView: View {
    let userId: Int
    @State private var user: User?

    var body: some View {
        Group {
            if let user = user {
                Text(user.name)
            } else {
                ProgressView() // 로딩 인디케이터
            }
        }
        // userId가 변경될 때마다 이 task가 다시 시작됩니다.
        .task(id: userId) {
            do {
                self.user = try await fetchUser(id: userId)
            } catch {
                print("Failed to fetch user: \(error)")
            }
        }
    }
}
```
