// 영상 3.1

// 오버로딩 : 여러가지의 함수가 같은 이름을 가질수 있게 하나 타입이나 개수에 따라 처리할수 있게 하는것
// 오버로딩을 하면서 오류가 나지 않게 하려면 각각의 변 수 타입을 if문으로 확인하고 그에 맞는 작업이 필요
{
  // 함수 오버로딩 시그니처
  function greet(name: string): string; // 문자열을 받아서 문자열 반환
  function greet(age: number): string; // 숫자를 받아서 문자열 반환

  // 함수 구현
  function greet(value: string | number): string {
    if (typeof value === "string") { // 타입 가드
      return `Hello, ${value}!`;
    } else {
      return `You are ${value} years old!`;
    }
  }

  console.log(greet("John")); // "Hello, John!"
  console.log(greet(25)); // "You are 25 years old!"

  //다중 시그니처 정의(함수에 들어갈 매개변수 수가 정해지지 않았을때 사용)
  type Add = {
    (a: number, b: number): number;
    (a: number, b: number, c: number): number;
  };

  const add: Add = (a, b, c?: number) => {
    if (c === undefined) {
      return a + b + c;
    } else {
      return a + b;
    }
  };

  add(1, 2); // 2개일때도 가능
  add(1, 2, 3); // 3개일때도 가능
}
