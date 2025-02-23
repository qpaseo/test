// 영상 2.2

// 타입 지정
{
  let a: number = 10;
  let b: boolean = true;
  let c: string = "10";
  let d: number[] = [1, 2, 3];

  // 사용자 지정 타입 지정
  type Age1 = number;
  type Name1 = string;
  type Palyer1 = {
    // L 사용자 정의 타입(첫 글자는 대문자로!)
    name: Name1;
    age?: Age1; // << 선택적 타입
  };

  // 사용자 지정 타입 사용
  const Nico: Palyer1 = {
    name: "nico",
  };

  // 사용자 지정 타입 사용
  const Lynn: Palyer1 = {
    name: "nico",
  };

  //if문 사용
  if (Nico.age && Nico.name == "nico") {
    // << 았는지 확인하고 조건을 수행해야 ts가 안뻑침
  }

  // 반환 타입 지정

  // function name(받는거) : 반환하는거 {

  // }

  function palyerMaker(name: string): Palyer1 {
    return {
      name, // << 이름과 값의 변수 이름이 같아면 생략가능
    };
  }

  const seo = palyerMaker("seo");
  seo.age = 12; // 추카
}
