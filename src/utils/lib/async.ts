import { Request, Response, NextFunction, RequestHandler } from "express";

export function async(fn: RequestHandler) {
    return function asyncWrapper(req: Request, res: Response, next: NextFunction) {
        const fnReturn = fn(req, res, next)
        return Promise.resolve(fnReturn).catch(next)
    }
}


