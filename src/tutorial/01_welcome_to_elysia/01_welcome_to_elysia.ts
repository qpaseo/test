//기본
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello Elysia!')
	.post('/', ({body, query, headers}) => {
		return {
			body,
			query,
			headers
		}
	})
	.listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
