// 중요한 개념 모음

//제네릭 예시
//제네릭 : 티입을 받는 변수, 들어오는 값에따라 타입을 받아오며 타입 관련 오류를 방지하기 위해 사용한다.
{
  function printArray<T>(arr: T[]): void {
    arr.forEach((element) => {
      console.log(element);
    });
  }

  printArray([1, 2, 3]); // number[]
  printArray(["a", "b", "c"]); // string[]

  interface Pair<T, U> {
    first: T;
    second: U;
  }

  const pair: Pair<string, number> = { first: "a", second: 1 };
}

//api연결 예시
interface SuccessResponse {
  status: "success";
  data: {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
  }[];  // 배열로 변경 (다수의 정보 받아오기)
}


interface ErrorResponse {
  status: "error";
  message: string;
}

type ApiResponseWrapper = SuccessResponse | ErrorResponse;

import axios from "axios";

async function fetchData(): Promise<ApiResponseWrapper> {
  const response = await axios.get<ApiResponseWrapper>(
    "https://api.example.com/data"
  );
  return response.data;
}
