import { Response, Request, NextFunction } from 'express'
import { AppError, InternalServerError } from '../../interfaces/http/errors'

export const errorHandler = (
    error: unknown,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (error instanceof AppError) {
        console.log(error)
        response.status(error.statusCode).json({
            name: error.name,
            message: error.message,
        })
        return
    } else {
        console.error('Unexpected error:', error)
        const internalError = new InternalServerError()
        response.status(internalError.statusCode).json({
            name: internalError.name,
            message: internalError.message,
        })
    }
}
