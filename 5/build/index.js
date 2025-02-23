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
//5.4 (js파일(라이브러리)을 사용하는 방법[나중에 개발후 js를 불러올땨 사용])
import { init, exit } from "./myPackage.js";
init({ url: "http://www.example.com" });
exit(0);
