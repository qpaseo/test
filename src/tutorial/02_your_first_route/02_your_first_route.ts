//라우트
import { Elysia } from "elysia";

new Elysia()
  .get("/elysia", "Hello Elysia!")
  .get("/friends/:name?", ({ params: { name } }) => `Hello ${name}!`)
  .get("/flame-chasers/*", ({ params }) => params["*"])
  .listen(3000);
