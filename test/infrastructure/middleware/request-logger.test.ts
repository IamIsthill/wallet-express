import { describe, it, vi, expect, beforeEach } from 'vitest'
import { requestLogger } from '../../../src/infrastructure/middleware'
import request from 'supertest'
import express from 'express'
import { Logger } from '../../../src/application/shared'

const mockLogger: Logger = {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
}

describe('Request Logger Middleware', () => {
    let app: express.Express

    beforeEach(() => {
        vi.clearAllMocks()

        app = express()

        app.use(requestLogger(mockLogger))

        app.get('/', (request, response, _next) => {
            response.sendStatus(200)
        })

        app.use(
            (
                error: unknown,
                reqs: express.Request,
                response: express.Response,
                _next: express.NextFunction
            ) => {
                response.sendStatus(500)
            }
        )
    })

    it('should log twice', async () => {
        await request(app).get('/')

        expect(mockLogger.info).toHaveBeenCalledTimes(2)
        expect(mockLogger.info).toHaveBeenNthCalledWith(
            1,
            'Request received',
            expect.objectContaining({
                method: 'GET',
                url: '/',
                timestamp: expect.any(String),
            })
        )
        expect(mockLogger.info).toHaveBeenNthCalledWith(
            2,
            'Request processed',
            expect.objectContaining({
                method: 'GET',
                url: '/',
                status: 200,
                duration: expect.any(Number),
                timestamp: expect.any(String),
            })
        )
    })

    it('should log response with correct status code for 404', async () => {
        await request(app).get('/non-existent')

        expect(mockLogger.info).toHaveBeenNthCalledWith(
            1,
            'Request received',
            expect.objectContaining({ url: '/non-existent' })
        )
        expect(mockLogger.info).toHaveBeenNthCalledWith(
            2,
            'Request processed',
            expect.objectContaining({ status: 404 })
        )
    })
})
