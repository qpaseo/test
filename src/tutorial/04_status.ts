//status, set 설정
import { Elysia } from "elysia";

new Elysia()
  .get("/", ({ status, set }) => {
    set.headers["x-powered-by"] = "Elysia";
    return status(418, "Hello Elysia!");
  })
  .get("/docs", ({ redirect }) => redirect("https://elysiajs.com"))
  .listen(3000);
