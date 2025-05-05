import { Request, Response, NextFunction } from 'express'
import { Logger } from '../../application/shared'

export function requestLogger(logger: Logger) {
    return function (request: Request, response: Response, next: NextFunction) {
        const { method, url } = request
        const start = Date.now()

        // Log the request
        logger.info('Request received', {
            method,
            url,
            timestamp: new Date().toISOString(),
        })

        // Set up listener to log when response was sent
        response.on('finish', () => {
            const duration = Date.now() - start
            logger.info('Request processed', {
                method,
                url,
                status: response.statusCode,
                duration,
                timestamp: new Date().toISOString(),
            })
        })
        next()
    }
}
