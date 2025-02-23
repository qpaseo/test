//요소를 ref로 연결시 간단하게 onclick함수를 등록해주는 사용자 정의 훅

import { useRef, useEffect } from "react";

export const useClick = (onClick: Function) => {
  //HTMLDivElement : div
  //HTMLButtonElement : button
  //HTMLInputElement : input
  //HTMLHeadingElement  : h1,h2,h3 등
  const element = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (element.current) {
      element.current.addEventListener("click", onClick());
    }
    return () => element.current?.removeEventListener("click", onClick());
  });
  return element;
};

//사용예시
// export const UseClick = () => {
//   const sayHello = () => console.log("hello");
//   const title = useClick(sayHello);
//   return (
//     <div>
//       <h1 ref={title}>hi!</h1>
//     </div>
//   );
// };
