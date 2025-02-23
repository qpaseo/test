//보통은 type을 모아 interface을 구성하고 사용함

{
  type Team = "read" | "bule" | "yellow";
  type Hialth = 0 | 5 | 10;

  // interface 타입의 모양을 설명하기 위한 함수
  //이름이 같은면 알아서 합쳐줌
  interface User {
    name: string;
  }

  //interface 끼리는 타입 상속이 가능
  interface Player extends User {}

  const seo: Player = {
    name: "seo",
  };
}
