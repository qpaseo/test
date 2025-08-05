# TanStack Virtual

## 1. 이름
**TanStack Virtual** (구 React Virtual)

## 2. 설명
TanStack Virtual은 대규모 데이터 목록을 렌더링할 때 발생하는 성능 문제를 해결하기 위한 **헤드리스(Headless) 가상화(Virtualization) 유틸리티**입니다. 수백, 수천 개의 아이템을 한 번에 DOM에 렌더링하는 대신, 현재 사용자에게 보여지는(viewport에 들어오는) 아이템들만 렌더링하여 DOM 요소의 수를 최소화하고 렌더링 성능을 극대화합니다. TanStack의 다른 라이브러리처럼 헤드리스 방식이므로, 어떤 UI 컴포넌트와도 함께 사용할 수 있습니다.

## 3. 사용되는 상황
- 매우 긴 목록(예: 수천 개의 채팅 메시지, 타임라인 피드, 거대한 데이터 테이블의 행)을 렌더링해야 할 때
- 스크롤 시 버벅임(jank)이나 성능 저하가 발생하는 것을 막고 싶을 때
- 무한 스크롤(Infinite Scrolling)을 구현하면서도 성능을 유지하고 싶을 때
- 수직 스크롤 목록뿐만 아니라 수평 스크롤 목록이나 그리드(Grid) 형태의 가상화가 필요할 때

## 4. 사용하면 좋은 이유
- **엄청난 성능 향상:** 전체 목록의 크기와 상관없이, 화면에 보이는 몇 개의 아이템만 렌더링하므로 초기 로딩 속도가 매우 빠르고 스크롤이 부드러워집니다. 메모리 사용량도 크게 줄어듭니다.
- **UI 자율성:** 헤드리스 방식이므로, 각 목록 아이템의 스타일이나 구조를 원하는 대로 자유롭게 구성할 수 있습니다.
- **간단한 API:** `useVirtualizer` 훅을 사용하여 몇 가지 옵션(`count`, `getScrollElement`, `estimateSize`)만 설정해주면 복잡한 계산 로직 없이도 쉽게 가상화를 구현할 수 있습니다.
- **다양한 방향 지원:** 기본적인 수직 스크롤뿐만 아니라 수평 스크롤, 양방향 그리드 형태의 가상화도 지원합니다.

## 5. 예시 코드 (React 기준)

```jsx
import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

// 예시를 위한 10,000개의 아이템 생성
const allItems = Array.from({ length: 10000 }, (_, i) => `Item #${i}`);

function MyVirtualizedList() {
  // 스크롤될 부모 컨테이너의 ref
  const parentRef = useRef(null);

  // useVirtualizer 훅 사용
  const rowVirtualizer = useVirtualizer({
    count: allItems.length, // 전체 아이템의 개수
    getScrollElement: () => parentRef.current, // 스크롤 컨테이너 요소를 반환하는 함수
    estimateSize: () => 35, // 각 아이템의 예상 높이 (px). 정확하지 않아도 됨.
    overscan: 5, // 화면에 보이는 아이템 외에 위아래로 추가 렌더링할 아이템 개수
  });

  return (
    // 1. 스크롤 컨테이너 (부모)
    <div
      ref={parentRef}
      style={{
        height: '400px',
        overflow: 'auto', // 스크롤이 가능해야 함
        border: '1px solid black',
      }}
    >
      {/* 2. 전체 스크롤 공간을 차지할 요소 (가상 높이) */}
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {/* 3. 화면에 보일 아이템들만 렌더링 */}
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              // 각 아이템을 정확한 위치로 이동
              transform: `translateY(${virtualItem.start}px)`,
              borderBottom: '1px solid #eee',
              padding: '5px 10px',
            }}
          >
            {allItems[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 6. 입문자를 위한 정보
- **`estimateSize`의 역할:** 이 옵션은 전체 스크롤 바의 크기를 계산하고, 각 아이템의 위치를 추정하는 데 사용됩니다. 모든 아이템의 높이가 동일하다면 정확한 값을, 다르다면 평균적인 값을 제공하는 것이 좋습니다. 라이브러리가 렌더링 후 실제 크기를 측정하여 보정하므로 완전히 정확할 필요는 없습니다.
- **`overscan` 옵션:** 사용자가 빠른 속도로 스크롤할 때, 미처 렌더링되지 않은 빈 공간이 잠시 보이는 것을 방지하기 위한 옵션입니다. `overscan: 5`는 현재 보이는 아이템의 위/아래로 5개씩 아이템을 추가로 렌더링하여 부드러운 스크롤 경험을 제공합니다.
- **동적 높이를 가진 아이템:** 만약 아이템들의 높이가 모두 다르다면, `estimateSize`에 평균적인 높이를 제공하고, 렌더링된 후 `virtualItem.measureElement` 함수를 호출하여 실제 높이를 측정하고 라이브러리에 알려줄 수 있습니다.
- **가상화의 구조 이해하기:** 코드가 3개의 `div`로 구성된 이유를 이해하는 것이 중요합니다.
    1.  **스크롤 컨테이너:** 실제 스크롤이 발생하는 바깥 `div`입니다. `overflow: auto`와 고정된 높이를 가집니다.
    2.  **전체 높이 컨테이너:** 스크롤 컨테이너 내부에 있으며, 전체 아이템이 렌더링되었을 때의 총 높이(가상 높이)를 가집니다. 이 요소 덕분에 스크롤 바가 올바르게 표시됩니다.
    3.  **개별 아이템:** `position: absolute`를 사용하여 전체 높이 컨테이너 내부에 렌더링됩니다. `transform: translateY` 속성을 이용해 스크롤 위치에 따라 정확한 자리로 이동합니다.
