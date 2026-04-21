import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		schema: 'standalone', //독립된 스키마로 선언
		body: t.Object({
			age: t.Number()
		})
	})
	.post(
		'/user',
		// body will have both age and name property
		({ body }) => body,
		{
			body: t.Object({
				name: t.String()
			})
		}
	)
	.listen(3000)