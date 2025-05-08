import express from 'express'
import { accountRouter } from '../interfaces/http'
import { errorHandler, requestLogger } from '../infrastructure/middleware'
import { logger } from '../infrastructure/logger'

export function createApp() {
    const app = express()

    app.use(express.json())
    app.use(requestLogger(logger))
    app.use('/v1/accounts', accountRouter)
    app.use(errorHandler(logger))

    return app
}
