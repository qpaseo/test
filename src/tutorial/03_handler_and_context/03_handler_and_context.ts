//headers, body, query 추출
import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'Hello Elysia!')
	.post('/',({headers,body, query}) =>{
		return {
			body,
			query,
			headers
		}
	})
	.listen(3000)
