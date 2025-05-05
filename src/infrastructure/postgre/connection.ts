import { Sequelize } from 'sequelize'
import { ENVIRONMENT } from '../../config'

export const sequelize = new Sequelize(ENVIRONMENT.DB_URL)
