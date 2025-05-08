import { Request, Response, NextFunction } from 'express'
import { randomUUID } from 'node:crypto'

export function attachRequestId(
    request: Request,
    response: Response,
    next: NextFunction
) {
    request.id = randomUUID()
    next()
}
