import { Elysia } from "elysia";

//1. Decorate (해당하는 elysia 객채에서 공유하고 사용할수 있으며, 변할수 없고 참고만 가능)
class Logger {
  log(value: string) {
    console.log(value);
  }
}
new Elysia()
    .decorate("logger", new Logger())
    .get("/", ({ logger }) => {
        logger.log("hi");
        return "hi";
        });