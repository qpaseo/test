// 영상 2.3
{
  type Age2 = Number;
  type Name2 = string;
  type Palyer2 = {
    // L 사용자 정의 타입사용
    readonly name: Name2;
    age?: Age2; // << 선택
  };

  // 객체 읽기 전용
  type Palyer3 = Readonly<{
    name: Name2; // << 읽기 전용
    age?: Age2; // << 선택
  }>;

  // 배열 읽기 전용
  const numbers: readonly number[] = [1, 2, 4, 4];

  // 배열의 요소각각 타입 지정
  const palyer4: [string, number, boolean] = ["1", 3, true];

  // 배열의 요소각각 타입 지정 + 읽기 전용
  const number_str: readonly [number, number, string] = [1, 1, "1"];

  // 객채의 key와 value 타입 지정
  const palyer5: {
    [key: number]: string;
  } = {
    1: "w",
  };
}
