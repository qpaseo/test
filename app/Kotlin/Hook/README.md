# 상태 관리 (React Hooks와 유사한 개념)

Jetpack Compose는 UI를 상태(State)의 함수로 간주하는 선언형 UI 패러다임을 따릅니다. 이는 "UI = f(state)" 라는 공식으로 표현할 수 있으며, React가 컴포넌트를 상태의 함수로 보는 것과 정확히 일치합니다. 따라서 React의 Hooks와 매우 유사한 개념들이 존재합니다.

## `remember` 와 `mutableStateOf` (React의 `useState`와 유사)

Composable 함수 내에서 상태를 기억하고, 그 상태가 변경될 때 UI를 자동으로 다시 그리게(Recomposition) 하려면 `remember`와 `mutableStateOf`를 함께 사용합니다.

- `mutableStateOf(초기값)`: 변경 가능한 상태를 담는 '상자'를 만듭니다. 이 상자의 내용물이 바뀌면 Compose는 이를 감지합니다.
- `remember { ... }`: Composable 함수가 재호출(Recomposition)되더라도 `{...}` 블록 안의 값은 초기화되지 않고 계속 기억됩니다. `useState`가 리렌더링 되어도 값을 유지하는 것과 같습니다.

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

**Compose `remember { mutableStateOf() }` 예시:**
```kotlin
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue

@Composable
fun Counter() {
    // `by` 키워드를 사용하면 .value 없이 직접 값에 접근할 수 있어 편리합니다.
    var count by remember { mutableStateOf(0) }

    Button(onClick = { count++ }) {
        Text("You've clicked me $count times")
    }
}
```

---

## `LaunchedEffect` (React의 `useEffect`와 유사)

특정 상태가 변경되었을 때나, Composable이 처음 화면에 나타났을 때 특정 코드(주로 코루틴을 사용한 비동기 작업, 예: API 호출)를 실행하고 싶을 때 사용합니다.

- `LaunchedEffect(key1, key2, ...)`: `key`로 지정된 상태값이 변경될 때마다 블록 안의 코루틴 코드를 재실행합니다.
- `key`가 `Unit`이나 `true`이면 Composable이 처음 화면에 그려질 때 **한 번만** 실행됩니다. (React `useEffect`의 `[]` 의존성 배열과 동일)

**React `useEffect` 예시:**
```jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // userId가 변경될 때마다 API를 호출하여 사용자 정보를 가져옵니다.
    fetchUser(userId).then(data => setUser(data));
  }, [userId]); // 의존성 배열

  if (!user) {
    return <div>Loading...</div>;
  }
  return <div>{user.name}</div>;
}
```

**Compose `LaunchedEffect` 예시:**
```kotlin
import androidx.compose.material3.Text
import androidx.compose.runtime.*

// data class User(val name: String)
// suspend fun fetchUser(userId: String): User { ... }

@Composable
fun UserProfile(userId: String) {
    var user by remember { mutableStateOf<User?>(null) }

    // userId가 변경될 때마다 LaunchedEffect 블록이 재실행됩니다.
    LaunchedEffect(userId) {
        user = fetchUser(userId) // suspend 함수 호출
    }

    if (user == null) {
        Text("Loading...")
    } else {
        Text(user!!.name)
    }
}
```
