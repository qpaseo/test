import { opentelemetry } from '@elysiajs/opentelemetry'
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg'

// OpenTelemetry 기본 설정 + DB 자동 추적 설정
export const instrumentation = opentelemetry({
	instrumentations: [
		// pg 라이브러리 쿼리를 자동 trace
		new PgInstrumentation()
	]
})