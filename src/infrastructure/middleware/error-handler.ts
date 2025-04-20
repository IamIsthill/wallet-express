import { Response, Request } from 'express'
import { AppError, InternalServerError } from '../../interfaces/http/errors'

export const errorHandler = (
    error: unknown,
    request: Request,
    response: Response
) => {
    if (error instanceof AppError) {
        response.status(error.statusCode).json({
            name: error.name,
            message: error.message,
        })
    } else {
        console.error('Unexpected error:', error)
        const internalError = new InternalServerError()
        response.status(internalError.statusCode).json({
            name: internalError.name,
            message: internalError.message,
        })
    }
}
