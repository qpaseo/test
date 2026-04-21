import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(
		openapi({
			documentation: {
				// Swagger UI에서 API 그룹을 나누는 태그 정의
				tags: [
					{ name: 'User', description: 'User related APIs' },
					{ name: 'Admin', description: 'Admin APIs' }
				]
			}
		})
	)

	.model({
		// 재사용 가능한 request/response 스키마 정의
		age: t.Object({
			age: t.Number()
		}),

		user: t.Object({
			id: t.Number(),
			name: t.String()
		})
	})

	.post(
		'/user',
		({ body }) => body,
		{
			// model에 등록된 age 스키마를 body로 사용
			body: 'age',

			// OpenAPI 문서용 메타데이터 (실행 로직과 무관)
			detail: {
				summary: 'Create user with age',
				tags: ['User']
			}
		}
	)

	.get(
		'/user/:id',
		() => {
			// 실제 비즈니스 로직 (DB 조회 등 위치)
			return { id: 1, name: 'kim' }
		},
		{
			// response를 model 기반으로 정의
			response: {
				200: 'user'
			},

			// 문서 설명
			detail: {
				summary: 'Get user',
				tags: ['User']
			}
		}
	)

	.post(
		'/internal/debug',
		() => {
			return 'hidden route'
		},
		{
			// Swagger 문서에서 완전히 숨김
			detail: {
				hide: true
			}
		}
	)

	.post(
		'/admin/create',
		({ body }) => {
			// 관리자 로직 위치 (권한 체크 / DB 생성 등)
			return body
		},
		{
			// request body는 age model 재사용
			body: 'age',

			// 문서 그룹 + 설명
			detail: {
				tags: ['Admin'],
				summary: 'Admin only endpoint',

				// 인증 스키마 문서화 (JWT 필요)
				security: [
					{
						bearerAuth: []
					}
				]
			}
		}
	)

	.listen(3000)