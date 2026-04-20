//라이프 사이클
//Hook : 이벤트 확인하고 작동하는 함수
//Local Hook ​: 특정 경로에서만 이벤트 감지하는 함수
//Interceptor Hook ​: 선언된 뒤에 있는 모든 경로에서 확인하는 함수
//
import { Elysia } from "elysia";

new Elysia()
  .onBeforeHandle(({ query: { name }, status }) => {
    if (!name) return status(401);
  })
  .get("/auth", ({ query: { name = "anon" } }) => {
    return `Hello ${name}!`;
  })
  .get("/profile", ({ query: { name = "anon" } }) => {
    return `Hello ${name}!`;
  })
  .listen(3000);
