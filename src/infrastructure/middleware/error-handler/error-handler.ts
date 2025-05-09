import { Response, Request, NextFunction } from 'express'
import { AppError, InternalServerError } from '../../../interfaces/http/errors'
import { Logger } from '../../../application/shared'

export function errorHandler(logger: Logger) {
    return (
        error: unknown,
        request: Request,
        response: Response,
        _next: NextFunction
    ) => {
        const { id } = request
        if (error instanceof AppError) {
            logger.debug(error.message, {
                requestId: id,
                code: error.statusCode,
                stack: error.stack,
            })
            response.status(error.statusCode).json({
                name: error.name,
                message: error.message,
            })
            return
        } else {
            logger.error('Unexpected error', {
                requestId: id,
                error,
            })
            const internalError = new InternalServerError()
            response.status(internalError.statusCode).json({
                name: internalError.name,
                message: internalError.message,
            })
        }
    }
}
