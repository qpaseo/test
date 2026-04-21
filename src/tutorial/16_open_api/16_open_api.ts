//open_api : 코드를 적으면 그 코드를 기반으로 open api 명세를 자동으로 생성
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.model({ //스키마 등록
		age: t.Object({ //여기에 있는 age가 이름
			age: t.Number() //이 age는 age 모델의 속성
		})
	})
	.post(
		'/',
		({ body }) => body,
		{
			body: 'age',//age 모델을 body로 사용하겠다
            detail: {
				summary: 'Create a user',
				description: 'Create a user with age',
				tags: ['User'],
			}
		}
	)
	.listen(3000)
