//요소 페이드 에니메이션 적용(18 버젼 부터는 사용 불가)

import { useEffect, useRef } from "react";

export const useFadeIn = (duration: number, delay: number) => {
  const element = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (element.current) {
      const { current } = element;
      current.style.opacity = "0"; // 초기 상태 설정
      current.style.transition = `opacity ${duration}s ease-in-out ${delay}`;

      setTimeout(() => {
        current.style.opacity = "1"; // 트랜지션 적용
      }, 10);
    }
  }, []);

  return element;
};

//사용 예시
// export const UseFadeIn = () => {
//   const fadeinH1 = useFadeIn(3, 0);
//   const fadeinP = useFadeIn(1, 0);

//   return (
//     <div>
//       <h1 ref={fadeinH1}>hello</h1>
//       <p ref={fadeinP}>lalala</p>
//     </div>
//   );
// };
