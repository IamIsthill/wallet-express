import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { createErrorHandler, ErrorConstructor } from './handle-service-error'
import { NextFunction } from 'express'

// Dummy errors
class CustomDomainError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CustomDomainError'
    }
}
class CustomHttpError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CustomHttpError'
    }
}

describe('createErrorHandler', () => {
    let mockNext: NextFunction

    const handler = createErrorHandler([
        {
            match: CustomDomainError as ErrorConstructor<Error>,
            toHttpError: (error) =>
                new CustomHttpError(`HTTP: ${error.message}`),
        },
    ])

    beforeEach(() => {
        vi.clearAllMocks()
        mockNext = vi.fn()
    })

    it('should map matching error and call next with transformed error', () => {
        const domainError = new CustomDomainError('something bad happened')

        handler(domainError, mockNext)

        expect(mockNext).toHaveBeenCalledWith(expect.any(CustomHttpError))
        const passedError = (mockNext as Mock).mock.calls[0][0]
        expect(passedError.message).toBe('HTTP: something bad happened')
    })

    it('should call next with original error if no mapping matches', () => {
        const someOtherError = new Error('unmapped error')

        handler(someOtherError, mockNext)

        expect(mockNext).toHaveBeenCalledWith(someOtherError)
    })
})
