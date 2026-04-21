/* --------------------------------------------------------------------
   MACRO 
   1. 첫 매개변수 "" 는 macro의 이름(식별자)이다
   - 단순 문자열이 아니라 "재사용 가능한 라우트 기능의 이름"
   - 이 이름을 기준으로 해당 macro 설정이 라우트에 적용된다

   2. macro는 무엇인가
   - 라우트 정의 시점에 동작을 확장하는 기능
   - resolve/derive처럼 요청 시점이 아니라 "라우트 등록 시점"에 적용됨
   - 스키마, beforeHandle, validation, hook 등을 자동 주입할 수 있음

   3. 동작 방식
   - .macro('auth', {...}) 로 기능 정의
   - 라우트에서 { auth: true } 로 해당 macro 사용 선언
   - 해당 라우트에는 macro에 정의된 스키마 및 로직이 자동 삽입됨

   4. 결과
   - 코드 중복 제거 (인증 로직 재사용)
   - 라우트 단위로 기능 조합 가능
   - 미들웨어보다 더 선언적인 구조

   5. derive / resolve와 차이
   - macro: 라우트 구조 자체를 변경 (정의 시점)
   - derive/resolve: 요청마다 실행되어 값 생성 (실행 시점)
-------------------------------------------------------------------- */
import { Elysia, t } from 'elysia'

function isPerfectSquare(x: number) { 
    const s = Math.floor(Math.sqrt(x))
    return s * s === x //이 부분으로 type이 number 로 추론되게 함
}

function isFibonacci(n: number) {
    if (n < 0) return false
    return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4)
}

new Elysia()
    .macro('isFibonacci', {
        body : t.Number(),
        beforeHandle({body, status}){ 
            if(!isFibonacci(body)) return status(418)

        }
    })
	.post('/', ({ body }) => body , {
        isFibonacci : true //macro - isFibonacci 사용 선언
    })
	.listen(3000)
