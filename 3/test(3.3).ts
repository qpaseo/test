// 영상 3.3
{
  type SuperPrint = {
    <T, M>(a: T[], b: M): T; // << 이 부분은 그져 함수의 배개변수 타입과 반환값을 정해주는 것일뿐
    // L  <T, M> 재내릭 사용 선언
  };

  const suprePtint: SuperPrint = (arr) => arr[0];

  const a = suprePtint([1, 2, true, false, "1", "2"], "d");
  const b = suprePtint([true, false], false);
}
