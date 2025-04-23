import express from 'express'
import http from 'node:http'
import { accountRouter } from '../interfaces/http'
import { errorHandler } from '../infrastructure/middleware'
import 'dotenv/config'
import { sequelize } from '../infrastructure/postgre'

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

try {
    console.log('Syncing databases...')
    sequelize.sync()
} catch (error) {
    console.log('Error syncinc databases:', error)
}

app.use(express.json())
app.use('/v1/accounts', accountRouter)
app.use(errorHandler)

server.listen(PORT, () => {
    console.log(`Wallet Server listening on port ${PORT}`)
})
