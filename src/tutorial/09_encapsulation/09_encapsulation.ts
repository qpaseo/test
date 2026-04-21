//각 elysia 객채는 캡슐화가 되어, 라이프 사이클 등이 격리됨
//local : 해당하는 인스턴스에만 사용가능
//scoped : 부모, 자식에서만 사용
//global : 전역으로 사용
//이런 캡슝화는 가드도 가능

import { Elysia, t } from "elysia";

const nameCheck = new Elysia().onBeforeHandle(
  { as: "scoped" },
  ({ query: { name }, status }) => {
    if (!name) return status(401);
  },
);

const ageCheck = new Elysia().guard({
  as: "global",
  query: t.Object({
    age: t.Number(),
    name: t.Optional(t.String()),
  }),
  beforeHandle({ query: { age }, status }) {
    if (age < 18) return status(403);
  },
});

const name = new Elysia().use(nameCheck).patch("/rename", () => "Ok! XD");

const profile = new Elysia()
  .use(ageCheck)
  .use(name)
  .get("/profile", () => "Hi!");

new Elysia().use(profile).listen(3000);
