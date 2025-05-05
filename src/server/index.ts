import express from 'express'
import http from 'node:http'
import { accountRouter } from '../interfaces/http'
import { errorHandler } from '../infrastructure/middleware'
import 'dotenv/config'
import { sequelize } from '../infrastructure/postgre'
import { ENVIRONMENT } from '../config'

const app = express()
const server = http.createServer(app)

try {
    console.log('Syncing databases...')
    sequelize.sync()
} catch (error) {
    console.log('Error syncinc databases:', error)
}

app.use(express.json())
app.use('/v1/accounts', accountRouter)
app.use(errorHandler)

server.listen(ENVIRONMENT.PORT, () => {
    console.log(`Wallet Server listening on port ${ENVIRONMENT.PORT}`)
})
