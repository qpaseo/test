import { describe , expect, test } from '@jest/globals'

import { Elysia } from 'elysia'

describe('Elysia', () => {
	test('should return Hello World', async () => {
		const app = new Elysia().get('/', 'Hello World')

	    const res = await app.fetch(new Request('http://localhost/'))
        const text = await res.text()

		expect(text).toBe('Hello World')
	})
})