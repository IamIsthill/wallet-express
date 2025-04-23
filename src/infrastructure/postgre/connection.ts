import 'dotenv/config'
import { Sequelize } from 'sequelize'

const connectionString = process.env.POSTGRE_URI as string

export const sequelize = new Sequelize(connectionString)
