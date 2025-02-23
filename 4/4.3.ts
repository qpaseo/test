//interface : 큰 하나의 덩어리(객체)의 구조를 정의하고 구조를 강제하기 위해 사용(오브젝트나 클래스의 형테 나머지는 type)
//추상 클래스 : 확장을 위해 사용(기본틀 재공[보통은 interface을 많이 씀])

{
  interface User {
    firstName: string;
    lastName: string;
    sayHi(name: string): string;
    fullName(): string;
  }

  class Player implements User {
    constructor(public firstName: string, public lastName: string) {}

    sayHi(name) {
      return "aa";
    }

    fullName() {
      return "bb";
    }
  }

  function makeUser(user: User): User {
    return {
      firstName: "nico",
      lastName: "seo",
      fullName: () => "ss",
      sayHi: (name) => "ss",
    };
  }

  makeUser({
    firstName: "nico",
    lastName: "seo",
    fullName: () => "ss",
    sayHi: (name) => "ss",
  });
}
