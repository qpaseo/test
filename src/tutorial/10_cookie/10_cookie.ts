//쿠키의 구조와 사용법, 서명
//쿠키의 구조 (set으로 접근해서 추가 수정 가능)
// visit = {
//   value: 실제 값,
//   httpOnly: 옵션,
//   path: 옵션(유효한 url[어떤 url에 쿠키를 포함할지]),
//   set: 쿠키 옵션
// }
// 쿠키 set 구조
// visit.set({
//   httpOnly: true,
//   secure: true,
//   maxAge: 3600
// })

import { Elysia, t } from "elysia";

new Elysia({
  cookie: {
    // 전역 기본 키
    secrets: "global-secret-key",
  },
})
  .get(
    "/",
    ({ cookie: { visit } }) => {
      visit.value ??= 0;
      visit.value += 1;

      visit.httpOnly = true;

      return `You have visited ${visit.value} times`;
    },
    {
      cookie: t.Cookie(
        {
          visit: t.Optional(t.Number()),
        },
        {
          // 라우트 전용 키 (전역보다 우선) [서명, 검증]
          secrets: ["route-secret-key", "old-route-secret-key"],

          // 서명 적용 대상
          sign: ["visit"],
        },
      ),
    },
  )
  .listen(3000);
