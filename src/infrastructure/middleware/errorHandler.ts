import { NextFunction, Response, Request } from "express";
import { AppError, InternalServerError } from "../../interfaces/http/errors";

export const errorHandler = (err:any, req:Request, res:Response, next: NextFunction) => {
    if(err instanceof AppError) {
        res.status(err.statusCode).json({
            name: err.name,
            message: err.message
        })
    } else {
        console.error('Unexpected error: ', err)
        const internalError = new InternalServerError()
        res.status(internalError.statusCode).json({
            name: internalError.name,
            message: internalError.message

        })
    }
}