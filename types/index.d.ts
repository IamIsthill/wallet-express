import 'express'
import { Logger } from '../src/application/shared'

declare module 'express-serve-static-core' {
    interface Request {
        id: string
        logger: Logger
    }
}
