//status, set 설정
import { Elysia } from "elysia";

new Elysia()
  .get("/", ({ status, set }) => {
    set.headers["x-powered-by"] = "Elysia";
    return status(418, "Hello Elysia!"); // return : 다른 로직은 실행되고 상태 코드만 변경, throw : 로직 정리 및 상태코드 변경
  })
  .get("/docs", ({ redirect }) => redirect("https://elysiajs.com"))
  .listen(3000);
