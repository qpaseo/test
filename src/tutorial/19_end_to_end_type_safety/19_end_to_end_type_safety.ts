import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/', 'Hello Elysia!')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })
	.listen(3000)

const api = treaty(app)

// Try hover over "data"
const { data, error } = await api.get()
