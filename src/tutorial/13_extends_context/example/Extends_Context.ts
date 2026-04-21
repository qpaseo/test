import Elysia from "elysia";

//3. Context 확장
new Elysia()
.derive(({ headers: { authorization } }) => ({
  authorization
}))
.get('/', ({ authorization }) => authorization) //원래는 headers.authorization으로 접근해야 하는 값을, authorization으로 바로 쓰게 만든 것