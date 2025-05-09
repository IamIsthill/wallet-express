import { describe, it, vi, expect, beforeEach, Mock } from 'vitest'
import { requestLogger } from './request-logger'
import { NextFunction, Request, Response } from 'express'
import { mockLogger } from '../../shared/test'

describe('Request Logger Middleware', () => {
    let request: Partial<Request>
    let response: Partial<Response>
    let next: NextFunction

    beforeEach(() => {
        vi.clearAllMocks()
        request = { method: 'GET', url: '/', id: 'requestId' }
        next = vi.fn()
        response = { statusCode: 200, on: vi.fn() }
    })

    it('logs request recieved and processed', () => {
        const middleware = requestLogger(mockLogger)

        //Capture the listener registered for 'finish
        let finishCallback: (() => void) | undefined
        ;(response.on as Mock).mockImplementation(
            (event: string, callback: () => void) => {
                if (event == 'finish') finishCallback = callback
            }
        )

        middleware(request as Request, response as Response, next)

        expect(mockLogger.info).toHaveBeenCalledWith(
            'Request received',
            expect.objectContaining({
                id: 'requestId',
                method: 'GET',
                url: '/',
                timestamp: expect.any(String),
            })
        )
        expect(response.on).toHaveBeenCalledWith('finish', expect.any(Function))

        finishCallback!()

        expect(mockLogger.info).toHaveBeenCalledWith(
            'Request processed',
            expect.objectContaining({
                id: 'requestId',
                method: 'GET',
                url: '/',
                status: 200,
                duration: expect.any(Number),
                timestamp: expect.any(String),
            })
        )
        expect(next).toHaveBeenCalledOnce()
    })
})
