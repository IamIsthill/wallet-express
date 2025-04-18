import express from 'express'
import http from 'node:http'
import mongoose from 'mongoose'
import { accountRouter } from '../interfaces/http'
import { errorHandler } from '../infrastructure/middleware'
import 'dotenv/config'

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/v1/accounts', accountRouter)
app.use(errorHandler)
try {
    mongoose.connect(process.env.DATABASE_URI as string)
} catch(err:any){
    console.log(err)
}

mongoose.connection.once("open", () => {
    server.listen(PORT, () => {
        console.log(`Wallet Server listening on port ${PORT}`)
    })
})

mongoose.connection.on("error", (err) => {
    console.error(err)
})