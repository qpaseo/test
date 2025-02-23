//배열이나 객채의 정보를 저장하고 인덱스로 접근 하기 쉽게 해주는 사용자 정의 훅

import { useState } from "react";

interface TabItem {
  id: number;
  tab: string;
  content: string;
}

export const useTaps = (initialTab: number, allTabs: TabItem[]) => {
  const [currentIndex, setCurrenIndex] = useState(initialTab);

  if (!allTabs || !Array.isArray(allTabs)) {
    return {
      currentItem: { tab: "", content: "내용이 없습니다." },
      changeItem: setCurrenIndex,
    };
  }
  return {
    currentItem: allTabs[currentIndex],
    changeItem: setCurrenIndex,
  };
};

//사용예시
// const content = [
//   {
//     id: 1,
//     tab: "Section 1",
//     content: "I'm the content of the Section 1",
//   },
//   {
//     id: 2,
//     tab: "Section 2",
//     content: "I'm the content of the Section 2",
//   },
// ];

// export const UseTabs = () => {
//   const { currentItem, changeItem } = useTaps(0, content);

//   return (
//     <div>
//       {content.map((section, index) => (
//         <button key={index} onClick={() => changeItem(index)}>
//           {section.tab}
//         </button>
//       ))}
//       <div>{currentItem.content}</div>
//     </div>
//   );
// };
