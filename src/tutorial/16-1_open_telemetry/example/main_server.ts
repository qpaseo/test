import { Elysia } from 'elysia'
import { opentelemetry, record, getCurrentSpan, setAttributes } from '@elysiajs/opentelemetry'
import { instrumentation } from './instrumentation_setting'

// fake DB
const db = {
	user: {
		find: async (id: number) => {
			return { id, name: 'kim' }
		}
	}
}

new Elysia()

	// OpenTelemetry 활성화
	.use(opentelemetry())

	// instrumentation (pg 같은 라이브러리 tracing)
	.use(instrumentation)

	/*
		LIFECYCLE TRACE 설명

		요청 흐름:
		derive → resolve → beforeHandle → handler
		이 모든 단계가 span으로 기록됨
	*/

	// derive: 요청 초기 단계 (context 생성)
	.derive(async function attachUser({ headers }) {
		// span 이름 = attachUser (function name 기반)
		const token = headers.authorization

		// current span에 정보 추가
		setAttributes({
			token_present: !!token
		})

		return {
			userId: token ? 1 : null
		}
	})

	// resolve: business validation + DB 접근 가능
	.resolve(async function loadUser({ userId, status }) {
		if (!userId) return status(401)

		// record = 특정 코드 블록 trace
		const user = await record('db.user.find', async () => {
			return db.user.find(userId)
		})

      

		// 현재 span 가져오기 (외부에서도 가능)
		const span = getCurrentSpan()

        if (span) { 
		    span.setAttributes({
			    user_loaded: true
		    })

    		return {
	    		user
    		}
        }
	})

	// 실제 API handler
	.get('/profile', ({ user }) => {
		// handler 자체도 span으로 기록됨
		return {
			message: 'profile loaded',
			user
		}
	})

	// streaming / SSE 예시
	.get('/stream', function* stream() {
		// SSE도 trace됨
		yield 'start\n'

		for (let i = 0; i < 3; i++) {
			yield `chunk ${i}\n`
		}

		yield 'end\n'
	})

	.listen(3000)