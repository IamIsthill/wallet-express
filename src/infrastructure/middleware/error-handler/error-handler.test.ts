import { Logger } from '../../../application/shared'
import { errorHandler } from './error-handler'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppError } from '../../../interfaces/http/errors'
import { Request, Response } from 'express'

describe('errorHandler', () => {
    let mockLogger: Logger
    const next = vi.fn()
    const request = { id: 'requestId' } as Request
    const response = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
    } as unknown as Response

    beforeEach(() => {
        vi.clearAllMocks()
        mockLogger = {
            debug: vi.fn(),
            error: vi.fn(),
            info: vi.fn(),
            warn: vi.fn(),
            withContext: vi.fn(),
        }
    })
    it('handles AppError and logs it', () => {
        const error = new AppError('Something went wrong', 400, false)

        const handler = errorHandler(mockLogger)
        handler(error, request, response, next)

        expect(mockLogger.debug).toHaveBeenCalledWith('Something went wrong', {
            requestId: 'requestId',
            code: 400,
            stack: expect.any(String),
        })
        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
            name: error.name,
            message: error.message,
        })
        expect(next).not.toHaveBeenCalled()
    })

    it('handles unexpected errors and logs it', () => {
        const error = new Error('Something went wrong')

        const handler = errorHandler(mockLogger)
        handler(error, request, response, next)

        expect(mockLogger.error).toHaveBeenCalledWith('Unexpected error', {
            requestId: 'requestId',
            error: error,
        })
        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.json).toHaveBeenCalledWith({
            name: 'InternalServerError',
            message: 'Internal Server Error',
        })
        expect(next).not.toHaveBeenCalled()
    })
})
