import { Request, Response, NextFunction } from 'express'
import { Logger } from '../../application/shared'

export function attachLogger(logger: Logger) {
    return (request: Request, _response: Response, next: NextFunction) => {
        request.logger = logger.withContext({ requestId: request.id })
        next()
    }
}
