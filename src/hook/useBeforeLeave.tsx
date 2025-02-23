//창에서 마우스가 나가면 함수를 편하게 사용할수 있도록 해주는 사용자 정의 훅

import React, { useEffect } from "react";

export const useBeforeLeave = (onBeforeUp: Function, onBeforeDown: Function) => {
  const handle = (event: MouseEvent) => {
    const { clientY } = event;
    if (clientY <= 0) {
      //위로 나가는거
      onBeforeUp();
    } else {
      //아래로 나가는거
      onBeforeDown();
    }
  };

  useEffect(() => {
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle);
  }, []);
};

//사용예시
// export const UseBeforeLeave = () => {
//   const begForUpLife = () => console.log("Pls dont leave");
//   const begForDownLife = () => console.log("Pls dont leave");
//   useBeforeLeave(begForUpLife, begForDownLife);
//   return (
//     <div>
//       <h1>hello</h1>
//     </div>
//   );
// };
