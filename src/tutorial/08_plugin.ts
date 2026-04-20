//Elysia 객채를 분리하고 합치기
import { Elysia } from "elysia";

const user = new Elysia()
  .get("/profile", "User Profile")
  .get("/settings", "User Settings");

new Elysia().get("/", "Home").use(user).listen(3000);
