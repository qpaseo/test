//객채지향 프로그래밍, 개념 기초
// constructor : ()매개변수 {}생성자 본문

{
  abstract class User {
    // 추상 클래스 : 클래스가 상속받을수 있는 클래스(보통 클래스들의 설개도로 사용함)
    constructor(
      private firstName: string, //private 해당하는 클래스 안에서만(그 클래스가 추상이라 하더라도)
      protected lastName: string, //protected : 해당하는 클래스와 상속 받는 클래스까지
      public nickName: string //public 클래스 밖에서도
    ) {}

    //추상 메소도 : 부르는 부분만 있는 메소드
    abstract getFullName(ar: string): void;

    public getLastName() {
      return `${this.lastName}`;
    }
  }

  class Player extends User {
    private position: string; // 추가 속성

    // Player 클래스의 생성자(상속후 추가로 생성하기 위해 사용하나 추가로 생성하지 않으면 사용X)
    constructor(
      firstName: string,
      lastName: string,
      nickName: string,
      position: string // Player에 추가된 속성
    ) {
      super(firstName, lastName, nickName); // 부모 클래스의 생성자 호출
      this.position = position; // Player에서 새로 추가한 속성 설정
    }

    // 추상 메소드 구현
    getFullName(ar: string): void {
      console.log(ar);
      console.log(this.lastName);
      console.log(this.nickName);
      console.log(this.position); // 추가된 position 출력
    }
  }

  const name = new Player("seo", "las", "seo", "forward");
  name.getFullName("a");
  name.getLastName();
}
