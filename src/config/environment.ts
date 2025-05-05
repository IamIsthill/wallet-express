import 'dotenv/config'
import { toBool } from '../utils/lib'
import { EnvironmentVariableError } from '../utils/errors'

const DB_URL = process.env.POSTGRE_URI

if (!DB_URL) {
    throw new EnvironmentVariableError()
}

export const ENVIRONMENT = {
    PORT: Number(process.env.PORT) || 3000,
    PROD: toBool(process.env.PROD),
    DEV: toBool(process.env.DEV),
    DB_URL: DB_URL,
}
