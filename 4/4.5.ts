interface SStorage<T> {
  [key: string]: T;
}

class LocalStorage<T> {// 선언
  private storage: SStorage<T>; //storage선언 하면서 구조에 <T>을 사용한다 선언

  constructor() {//생성
    this.storage = {};
  }

  set(key: string, value: T) {
    this.storage[key] = value;
  }
  remove(key: string) {
    delete this.storage[key];
  }
  get(key: string): T {
    return this.storage[key];
  }
  clear() {
    this.storage = {};
  }
}

const stringsStorage = new LocalStorage<string>()

stringsStorage.get("key")

const booleansStorage = new LocalStorage<boolean>()

booleansStorage.get("key")