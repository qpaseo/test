import { Elysia, t } from "elysia";

new Elysia()
  .post("/", ({ body }) => body, {
    body: t.Object({
      age: t.Number({
        error: "age is  must be a number",
      }),
    }),
  })
  .listen(3000);

  //Validation Detail ​구조
// **사용자 지정 오류 메세지릴 제공하면 유요성 검사 세부정보 전부 덮어쓰여짐
//   {
// 	"type": "validation",
// 	"on": "params",
// 	"value": { "id": "string" },
// 	"property": "/id",
// 	"message": "id must be a number", 
// 	"summary": "Property 'id' should be one of: 'numeric', 'number'",
// 	"found": { "id": "string" },
// 	"expected": { "id": 0 },
// 	"errors": [
// 		{
// 			"type": 62,
// 			"schema": {
// 				"anyOf": [
// 					{ "format": "numeric", "default": 0, "type": "string" },
// 					{ "type": "number" }
// 				]
// 			},
// 			"path": "/id",
// 			"value": "string",
// 			"message": "Expected union value",
// 			"errors": [{ "iterator": {} }, { "iterator": {} }],
// 			"summary": "Property 'id' should be one of: 'numeric', 'number'"
// 		}
// 	]
// }

