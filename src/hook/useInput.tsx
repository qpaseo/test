//input을 따로 가져와서 편하게 사용할수 있는 사용자 정의 훅

import { useState } from "react";

export const useInput = (initialValue: string, vaildator: Function) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (e: any) => {

    //이벤트 타겟 함수
    const {
      target: { value },
    } = e;

    let willUpdate = true;
    if (typeof vaildator === "function") {
        // 사용자의 함수(vaildator)가 참인지 확인 
      willUpdate = vaildator(value);
    }

    //위에서 참이면 값 업데이트
    if (willUpdate) {
      setValue(value);
    }
  };

  return { value, onChange };
};


//사용예시
// export const UseInput = () => {
//   const maxLen = (value: string) => {
//     //10줄 이하면 입력 금지
//     return !value.includes("@");
//   };
//   const name = useInput("Mr .", maxLen);

//   return (
//     <>
//       <input placeholder="Name" {...name} />
//     </>
//   );
// };
