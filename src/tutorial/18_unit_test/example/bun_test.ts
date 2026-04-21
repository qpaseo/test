import { describe, it, expect } from 'bun:test'

import { Elysia } from 'elysia'

describe('Elysia', () => {
    it('should return Hello World', async () => {
        const app = new Elysia().get('/', 'Hello World')

        const res = await app.fetch(new Request('http://localhost/'))
        const text = await res.text()

        expect(text).toBe('Hello World')
    })
})