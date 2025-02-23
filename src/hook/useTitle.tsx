//타이틀을 편하게 바꾸어주는 사용자 정의 훅

import { useEffect, useState } from "react";

export const useTitle = (initalTitle: string) => {
  const [title, setTitle] = useState(initalTitle);
  const upadateTitle = () => {
    const htmlTitle = document.querySelector("title");
    if (htmlTitle) {
      htmlTitle.innerText = title;
    }
  };
  useEffect(upadateTitle, [title]);
  return setTitle;
};

// export const UseTitle = () => {
//   const titleUpdater = useTitle("Loading...");
//   setTimeout(() => titleUpdater("Home"), 3000);
//   return <h1>hi!</h1>;
// };
