import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello World')
	.listen(3000)

//Elysia fetch 는 Response | Promise<Response> 둘다 가능해서 타입이 좁혀지지 않아 then을 사용할수 없었음
// app.fetch(new Request('http://localhost/'))
// 	.then((res) => res.text())
// 	.then(console.log)

const res = await app.fetch(new Request('http://localhost/'))
console.log(await res.text())    