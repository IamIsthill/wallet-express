import { NextFunction } from 'express'

export type ErrorConstructor<T extends Error> = new (...arguments_: unknown[]) => T

interface IErrorMap<T extends Error = Error> {
    match: ErrorConstructor<T>
    toHttpError: (error: T) => Error
}

export function createErrorHandler(map: IErrorMap[]) {
    return function handleServiceErrors(error: unknown, next: NextFunction) {
        for (const { match, toHttpError } of map) {
            if (error instanceof match) {
                return next(toHttpError(error as Error))
            }
        }
        return next(error)
    }
}
