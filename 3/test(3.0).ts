// 영상 2.4

// 함수 타입 지정
const add = (a: number, b: number) => {
  a + b;
};

function add2(a: number, b: number): number {
  return a + b;
}

// 함수에 시그니처(함수의 대략적인 타입과 구조 (call signature[콜 시그니처])
type Add = (a: number, b: number) => number;
type ADD = (a: number, b: number) => void;

function add3(a: number, b: number) {
  return a + b;
}
