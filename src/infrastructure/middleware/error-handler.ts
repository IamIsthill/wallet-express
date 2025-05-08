import { Response, Request, NextFunction } from 'express'
import { AppError, InternalServerError } from '../../interfaces/http/errors'
import { Logger } from '../../application/shared'

export function errorHandler(logger: Logger) {
    return (
        error: unknown,
        _request: Request,
        response: Response,
        _next: NextFunction
    ) => {
        if (error instanceof AppError) {
            logger.debug(error.message, { error })
            response.status(error.statusCode).json({
                name: error.name,
                message: error.message,
            })
            return
        } else {
            logger.error('Unexpected error', { error })
            const internalError = new InternalServerError()
            response.status(internalError.statusCode).json({
                name: internalError.name,
                message: internalError.message,
            })
        }
    }
}
