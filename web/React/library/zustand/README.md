# Zustand

- **카테고리**: 상태 관리 (State Management)
- **설명**: Zustand는 작고 빠르며 확장 가능한 상태 관리 솔루션입니다. Redux와 같은 라이브러리에 비해 매우 간단한 API와 최소한의 보일러플레이트를 제공하는 것이 특징입니다. Context API의 단점을 보완하고, 불필요한 리렌더링을 최소화하는 데 중점을 둡니다.

## 핵심 특징

- **간결한 API**: 스토어(store)를 만드는 데 `create` 함수 하나만 알면 됩니다.
- **Hooks 기반**: React Hooks를 사용하여 스토어의 상태를 구독하고 업데이트합니다.
- **보일러플레이트 없음**: `Provider`로 앱을 감쌀 필요가 없습니다. 어떤 컴포넌트에서든 스토어를 바로 가져와 사용할 수 있습니다.
- **불필요한 리렌더링 방지**: 스토어의 일부만 구독할 수 있어, 관련 있는 상태가 변경될 때만 컴포넌트가 리렌더링됩니다.

## 기본 사용법

1.  **스토어 생성**: `create` 함수를 사용하여 상태와 상태를 변경하는 액션(action)을 포함하는 스토어를 만듭니다.

    ```typescript
    // src/store.ts
    import { create } from 'zustand';

    type StoreState = {
      count: number;
      increase: () => void;
      decrease: () => void;
    };

    const useStore = create<StoreState>((set) => ({
      count: 0,
      increase: () => set((state) => ({ count: state.count + 1 })),
      decrease: () => set((state) => ({ count: state.count - 1 })),
    }));

    export default useStore;
    ```

2.  **컴포넌트에서 사용**: 생성한 스토어 Hook을 컴포넌트에서 직접 호출하여 상태와 액션을 사용합니다.

    ```tsx
    // src/components/Counter.tsx
    import React from 'react';
    import useStore from '../store';

    function Counter() {
      const { count, increase, decrease } = useStore();

      return (
        <div>
          <span>{count}</span>
          <button onClick={increase}>+</button>
          <button onClick={decrease}>-</button>
        </div>
      );
    }
    ```

3.  **상태의 일부만 구독하기 (성능 최적화)**: 렌더링 최적화를 위해 상태의 특정 부분만 선택하여 구독할 수 있습니다.

    ```tsx
    function CountDisplay() {
      // count가 변경될 때만 리렌더링됨
      const count = useStore((state) => state.count);
      return <span>{count}</span>;
    }
    ```
