//1. guard에서 공통으로 사용할 스키마를 지정할수 있음
//2. 각 라우트에서 스키마를 제공하면 가드에서 제공한 스키마가 완전 덮어짐
//3. guard에서만든 스키마랑 라우트에서 만들어질 스키마랑 같이 사용하고 싶다면 (덮어 쓰여지기 실다면 "독립된 스키마"로 정의함)

import { Elysia, t } from 'elysia'
import { z } from 'zod'

new Elysia()
	.guard({
        schema : "standalone", // override : 기본값 (라우트에서 스키마 만들면 전부 변경)
		body: z.object({
			age: z.number()
		})
	})
	.post(
		'/user',
		({ body }) => body,
		{
			body: t.Object({
				name: t.String()
			})
		}
	)
	.listen(3000)
