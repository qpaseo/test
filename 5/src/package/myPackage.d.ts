// ts와 호환되게 하기위해 정의 파일을 작성
// 이 파일은 tsconfig.json에 typeRoots로 지정된 경로에 위치해야 함
//사용자 지정 파일에서 사용

interface Confing {
  url: string;
}

declare module "myPackage" {
  function init(confing: Confing): boolean;
  function exit(code: number): number;
}
