# TanStack Query (Formerly React Query)

## 1. 이름
**TanStack Query** (구 React Query)

## 2. 설명
TanStack Query는 React, Solid, Vue, Svelte 등 다양한 프레임워크에서 **서버 상태(Server State)를 관리**하기 위한 강력한 라이브러리입니다. 데이터 페칭, 캐싱, 동기화, 업데이트와 관련된 복잡하고 반복적인 로직을 매우 간결하고 선언적인 코드로 처리할 수 있도록 도와줍니다. 클라이언트 상태가 아닌, 비동기적으로 가져오는 서버 데이터를 다루는 데 특화되어 있습니다.

## 3. 사용되는 상황
- API로부터 데이터를 가져와 화면에 표시해야 할 때
- 데이터 로딩 및 에러 상태를 손쉽게 관리하고 싶을 때
- 사용자의 인터랙션(예: 버튼 클릭)으로 서버 데이터를 변경(Create, Update, Delete)해야 할 때
- 동일한 데이터를 여러 컴포넌트에서 중복 호출 없이 공유하고 싶을 때
- 사용자가 다시 화면에 돌아왔을 때 자동으로 데이터를 갱신하고 싶을 때 (refetchOnWindowFocus)
- 페이지네이션(Pagination)이나 무한 스크롤(Infinite Scroll) 구현이 필요할 때

## 4. 사용하면 좋은 이유
- **보일러플레이트 코드 감소:** `isLoading`, `isError`, `data` 등의 상태를 직접 `useState`로 관리하고 `useEffect`로 비동기 로직을 작성하는 번거로움을 크게 줄여줍니다.
- **강력한 캐싱 전략:** 한 번 가져온 데이터는 메모리에 캐싱되어, 같은 데이터 요청 시 API 호출 없이 캐시된 데이터를 즉시 반환하여 UX를 향상시키고 서버 부하를 줄입니다.
- **자동 데이터 동기화:** stale-while-revalidate 전략을 기본으로 사용하여, 캐시된 데이터를 먼저 보여주고 백그라운드에서 최신 데이터를 가져와 화면을 자동으로 업데이트해줍니다.
- **Devtools 제공:** 쿼리의 상태, 캐시된 데이터, API 호출 시점 등을 시각적으로 확인하고 디버깅할 수 있는 강력한 개발 도구를 제공합니다.
- **낙관적 업데이트 (Optimistic Updates):** 서버의 응답을 기다리지 않고 UI를 먼저 성공한 것처럼 업데이트하여 매우 빠른 사용자 경험을 제공할 수 있습니다.

## 5. 예시 코드 (React 기준)

### 기본 `useQuery` 사용법
```jsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 데이터를 가져오는 비동기 함수
const fetchTodos = async () => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos');
  return data;
};

function Todos() {
  // useQuery 훅 사용
  const { data, error, isLoading } = useQuery({
    queryKey: ['todos'], // 쿼리를 식별하는 고유한 키
    queryFn: fetchTodos, // 데이터를 가져올 함수
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

### 데이터 변경을 위한 `useMutation`
```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// 새로운 todo를 추가하는 비동기 함수
const addTodo = async (newTodo) => {
  const { data } = await axios.post('https://jsonplaceholder.typicode.com/todos', newTodo);
  return data;
};

function AddTodoComponent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      // 성공 시 'todos' 쿼리를 무효화하여 다시 가져오도록 함
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <button
      onClick={() => {
        mutation.mutate({ title: 'New Todo', completed: false });
      }}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Adding...' : 'Add Todo'}
    </button>
  );
}
```

## 6. 입문자를 위한 정보
- **QueryKey가 핵심입니다:** `queryKey`는 TanStack Query가 캐시를 관리하는 열쇠입니다. 이 키를 기반으로 데이터를 캐싱하고, 업데이트하고, 무효화합니다. 배열 형태로 사용하는 것이 일반적이며, 동적인 파라미터가 있다면 `['todos', id]` 와 같이 포함시켜야 합니다.
- **서버 상태와 클라이언트 상태를 분리하세요:** 모든 상태를 TanStack Query로 관리할 필요는 없습니다. 다크 모드 토글, 모달 열림/닫힘 같은 순수한 클라이언트 상태는 `useState`나 `Zustand` 같은 상태 관리 라이브러리를 사용하는 것이 좋습니다. TanStack Query는 '서버로부터 온 데이터'를 관리하는 데 집중하세요.
- **Devtools를 꼭 설치하세요:** `@tanstack/react-query-devtools` 패키지를 설치하면 개발 중 쿼리 상태를 쉽게 파악할 수 있어 생산성이 매우 높아집니다.
- **`staleTime` vs `cacheTime`:**
    - `staleTime`: 데이터가 'fresh' 상태에서 'stale' 상태로 전환되는 데 걸리는 시간입니다. fresh 상태일 때는 데이터가 있어도 재호출(refetch)하지 않습니다. 기본값은 0입니다. (자주 바뀌지 않는 데이터라면 길게 설정하는 것이 좋음)
    - `cacheTime`: 데이터가 비활성(inactive) 상태일 때 캐시에서 유지되는 시간입니다. 이 시간이 지나면 가비지 컬렉션(GC)에 의해 제거됩니다. 기본값은 5분입니다.