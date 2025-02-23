// 영상 3.2
//polymorphous[다향성] : 여러가지 다른 구조물(여러가지 형태로 변할수 있는 함수)

{
  type SuperPrint = {
    (arr: number[]): void;
    (arr: boolean[]): void;
    (arr: string[]): void;
  };

  const suprePtint: SuperPrint = (arr) => {
    arr.forEach((i) => console.log(i));
  };

  suprePtint([1, 2, 3, 4]);
  suprePtint([false, true, false]);
  suprePtint(["a", "b", "c"]);
}

{
  type SuperPrint1 = {
    //제네릭 : 값들을 받아 자동으로 타입을 추측하여 자동으로 맞춰주는 ts의 테그(타입에 유연성 제공 [보통 T,V를 사용한다.])
    <TypePlaceholder>(arr: TypePlaceholder[]): void;
  };

  const suprePtint1: SuperPrint1 = (arr) => {
    // arr.forEach((i) => console.log(i));
    const a = suprePtint1([1, 2, true, false, "1", "2"]);
    const b = suprePtint1([true, false]);
    return a;
  };

  type SuperPrint2 = {
    <T>(arr: T[]): T;
    // L <T>로 타입을 인지
    // L <T>로 인지한 타입인 배열을 받는다
    // L <T>로 인지한 타입의 값을 반한
  };

  const suprePtint2: SuperPrint2 = (arr) => arr[0];

  const a = suprePtint2([1, 2, true, false, "1", "2"]);
  const b = suprePtint2([true, false]);
}
