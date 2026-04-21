//State, Decorate는 기본적으로 모든 요청과 인스턴스에서 공유
//Resolve, Derive 은 요청별로 적용되고 이것도 스코프 변경 가능
//{ as: 'scoped' }의 형식으로 스코프 지정 가능

import { Elysia, t } from 'elysia'

class Logger {
	log(info: string) {
		console.log(info)
	}
}

new Elysia()
	.decorate('logger', new Logger())
	.onRequest(({ request, logger }) => {
		logger.log(`Request to ${request.url}`)
	})
	.guard({
		query: t.Optional(
			t.Object({
				age: t.Number({ min: 15 })
			})
		)
	})
     .resolve(({query : {age}, status}) => {
        if(!age) return status(401)
        return {age}
    })
	.get('/profile', ({age}) => {return age})
	.listen(3000)

