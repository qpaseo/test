/* --------------------------------------------------------------------
Decorate vs Resolve/Derive Context 확장 차이

※ Decorate
- 앱 시작 시 1회 생성되는 singleton 객체 등록
- 모든 요청에서 동일한 인스턴스를 공유
- 상태를 가지면 위험 (요청 간 데이터 섞일 수 있음)
- 주로 logger, db client, config, util 같은 "공용 서비스"에 사용

※ Resolve / Derive (Context 확장)
- 요청마다 실행되어 "request 단위 값" 생성
- 각 요청별로 독립된 context에 값 주입
- 요청 간 절대 공유되지 않음 (stateless 보장)
- 인증 정보, 사용자 데이터, query 가공 결과 등에 사용

핵심 차이
- Decorate → "전역 1개 객체 (공유)"
- Resolve/Derive → "요청마다 새로 만들어지는 데이터"
-------------------------------------------------------------------- */

import { Elysia, t } from 'elysia' 

/* --------------------------------------------------------------------
Derive – **transform 단계**에서 실행됨
검증 없이 Authorization 헤더를 가져와
이후 모든 핸들러에서 `authorization`으로 사용 가능하게 함
-------------------------------------------------------------------- */
new Elysia()
	.derive(({ headers: { authorization } }) => ({
		authorization
	}))
	.get('/', ({ authorization }) => authorization)

/* --------------------------------------------------------------------
Resolve – **before-handle 단계**에서 실행됨
여기서는 query의 `age` 값을 검증함
스키마 검증에 실패하면 Elysia가 자동으로 400 응답 반환

※ Guard와의 차이
- resolve → 실제 로직으로 "값의 유효성" 검증 및 가공 가능
- guard → 스키마 기반으로 "형식/타입" 검증만 수행 (자동 400)
- guard는 선언적(schema), resolve는 명령형(code)
- guard는 값 변경 불가 / resolve는 값 생성 및 수정 가능
-------------------------------------------------------------------- */
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
	.resolve(({ query: { age }, status }) => {
		if(!age) return status(401)
		return { age }
	})
	.get('/profile', ({ age }) => age)
	.listen(3000)