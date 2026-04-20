//값 검증
import { Elysia, t, validationDetail } from "elysia";

new Elysia()
  .post(
    "/user",
    ({ body: { name } }) => {
      return `Hello ${name}!`;
    },
    {
      body: t.Object({
        name: t.String({
          //error : "id must be a string" //error.message 만 설정
          error: validationDetail("id must be a string"), //에러 상세 정보 같이 주는거 (자세한 정보를 주면 공격자한테 정보를 중수도 있으니 이렇게 설계함, [구성 파일 수정하면 변경 가능])
        }),
      }),
    },
  )
  .listen(3000);

//유효성검사 오류 전역으로 설정 예시
new Elysia()
  .onError(({ error, code }) => {
    if (code === "VALIDATION") return error.detail(error.message);
  })
  .get("/:id", ({ params: { id } }) => id, {
    params: t.Object({
      id: t.Number({
        error: "id must be a number",
      }),
    }),
  })
  .listen(3000);
