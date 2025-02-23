//5.2
// class Block {
//   constructor(protected data: string) {}
//   static hello() {
//     return "hi";
//   }
// }

//5.3 (js파일에서 정의 파일을 만들어서 사용하는 방법[처음 개발하면서 사용])
// import { init, exit } from "myPackage"; //외부모듈을 가져올때는 이렇게 가져옴(./처럼은 디랙토리에서 가져오는거)

// init({ url: "http://www.example.com" });

// exit(0);

//5.4 (js파일(라이브러리)을 사용하는 방법[나중에 개발후 js를 불러올때 사용])
// import { init, exit } from "./myPackage.js";

// init({ url: "http://www.example.com" });

// exit(0);

//5.5(자동으로 컴파일 & 블록체인 기초 & ts에서 js모듈 받아오는 방법)
import crypto from "crypto";

interface BlockShape {
  hash: string;
  prevHash: string;
  height: number;
  data: string;
}

class Block implements BlockShape {
  public hash: string;
  constructor(
    public prevHash: string,
    public height: number,
    public data: string
  ) {
    this.hash = Block.claculateHash(prevHash, height, data);
  }
  static claculateHash(prevHash: string, height: number, data: string): string {
    const toHash = `${prevHash}${height}${data}`;
    return crypto.createHash("sha256").update(toHash).digest("hex");
  }
}

class Blockcain {
  private blocks: Block[];
  constructor() {
    this.blocks = [];
  }

  private getPrevHash() {
    if (this.blocks.length === 0) {
      return "";
    } else {
      return this.blocks[this.blocks.length - 1].hash;
    }
  }

  public addBlock(data: string) {
    const blick = new Block(this.getPrevHash(), this.blocks.length + 1, data);
    this.blocks.push(blick);
  }
  public getBlocks() {
    return [...this.blocks]; // 복사버젼
  }
}

const blockchain = new Blockcain();

blockchain.addBlock("First");
blockchain.addBlock("Second");
blockchain.addBlock("Third");

console.log(blockchain.getBlocks());
