//가드 : 여러가지의 훅과 검증
import {
  Elysia, //t
} from "elysia";

new Elysia()
  .guard({
    beforeHandle: [
      ({ query: { name }, status }) => {
        if (!name) {
          return status(401);
        }
      },
    ],
    // query: t.Object({
    //   name: t.String(),
    // }), 이런식으로 값 검증도 가능
  })
  .get("/auth", ({ query: { name } }) => {
    console.log(`hello ${name}!`);
  })
  .get("/profile", ({ query: { name } }) => {
    console.log(`hello ${name}!`);
  })
  .listen(3000);
