{
  type Words = {
    [key: string]: { def: string; meaning: string };
  };

  class Dict {
    private words: Words;
    constructor() {
      this.words = {};
    }

    add(word: Word) {
      if (this.words[word.term] === undefined) {
        this.words[word.term] = { def: word.def, meaning: word.meaning };
      }
    }

    def(term: string) {
      //term을 기준으로 값만 찾는거
      return this.words[term];
    }

    delete(term: string) {
      //term을 기준으로 지우는거
      if (this.words[term]) {
        delete this.words[term];
      }
    }

    // update(word: Word) {
    //   //term을 기준으로 업데이트 하는거
    //   if (this.words[word.term]) {
    //     this.words[word.term] = { def: word.def, meaning: word.meaning };
    //   }
    // }

    printAll(term: string) {
      //term을 기준으로
      if (this.words[term]) {
        console.log(`${term}:`, this.words[term]);
      }
    }

    static hello() {
      // static 객채를 생성하지 않고 호출할수 있는 함수(클래스에 속해 있어 같은 값을 가진다.)
      //접근시 클래스 이름으로 접근한다, 인스턴스로 접근 못함
      return "hello";
    }

    static a = 10; // 변할수 있음
    static readonly b = 10; //변할수 없음
  }

  class Word {
    constructor(
      public readonly term: string, // 읽을수는 있지만 쓸수는 없음
      public def: string,
      public meaning: string
    ) {}
  }

  const kimchi = new Word(
    "kimchi",
    "한국의 음식",
    "양베추에 고추장 해서 먹는거, 좀 매운거"
  );

  const dict = new Dict();

  dict.add(kimchi);
  dict.def("kimchi");
}
