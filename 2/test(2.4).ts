// 영상 2.4

{
  let a: unknown; // << 아모른직다

  if (typeof a === "number") {
    let b = a + 1; // << a를 number로 확인해서 a는 if문 안에서는 number이다
  }

  if (typeof a === "string") {
    let b = a.toUpperCase();
  }

  //void : 반환값이 없는 함수
  function hello() {
    console.log("hello");
  }

  const c = hello();

  //never : 반환값이 절대 없는 함수
  //나는 이 함수에서 반환값을 사용허지 않을꺼에요~ 라는 것
  //(실행되면 안되는 함수[예외처리, 오류드랍] 즉 예외를 처리할때 사용하는 함수)
  function hello2(name: string | number) {
    if (typeof name === "string") {
      name;
    }
    if (typeof name === "number") {
      name;
    } else {
      // << naver 함수
      name;
    }
  }

  //void : 기본으로 반환을 하지 않는 함수 (undefined만 반환)
  //나는 이 함수에서 반환값을 사용허지 않을꺼에요~ 라는 것
  //(실행을 할수 있는 [정상적으로 동작하는]함수에 사용)
  function hello3(name: string): void {
    console.log(name);
  }

  const b = (): void => {
    console.log("dafs");
  };
}
