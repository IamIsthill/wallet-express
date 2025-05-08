import express from 'express'
import { accountRouter } from '../interfaces/http'
import { errorHandler, requestLogger } from '../infrastructure/middleware'
import { ConsoleLogger } from '../infrastructure/logger'

export function createApp() {
    const app = express()

    app.use(express.json())
    app.use(requestLogger(new ConsoleLogger()))
    app.use('/v1/accounts', accountRouter)
    app.use(errorHandler)

    return app
}
