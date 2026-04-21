import { Elysia } from "elysia";

class YourError extends Error {
  status = 418;

  constructor(message: string) {
    super(message);
  }

  // 추가적으로 지정하여 응답 수정
  // toResponse() {
  //   return { message: this.message };
  // }
}

new Elysia()
  .error({
    YOUR_ERROR: YourError,
  })
  .onError(({ code, status }) =>  { // code : 에러 식별값, status : 응답 생성 함수
    if (code == "NOT_FOUND") {
      return "Hi!";
    }
  })
  .get("/", () => {
    throw new YourError("hello!");
  })
  .listen(3000);

//==================================================================

//에러 중앙에서 처리시에 타입 자동 추론 예시
class MyError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

new Elysia()
  .error({
    MyError,
  })
  .onError(({ code, error }) => {
    switch (code) {
      // 이 case 에서는 error가 자동으로 MyError타입으로 추론
      case "MyError":
        //여기서 마우스로 확인하면 에러 타입이 MyError타입으로 추론됨
        return error;
    }
  })
  .get("/:id", () => {
    throw new MyError("Hello Error");
  });

//사용자 지정 오류 응답

class MyError2 extends Error {
  status = 418;

  constructor(public message: string) {
    super(message);
  }

  toResponse() {
    return Response.json(
      {
        //여기는 반환되는 body (사용자 지정 응답)
        error: this.message,
        code: this.status,
      },
      {
        // 여기는 http body
        status: 418, //둘이 이렇게 다르게도 가능하나 보통 this.status을 사용
      },
    );
  }
}

//status의 2가지 사용법
new Elysia()
  .onError(({ code, error, path }) => {
    if (code === 418) return "caught";
  })
  .get("/throw", ({ status }) => {
    // 에러가 반환되고 해당하는 로직 종료
    throw status(418);
  })
  .get("/return", ({ status }) => {
    // 상태 코드만 반환하고 다른 로직은 정상적으로 작동
    return status(418);
  });
