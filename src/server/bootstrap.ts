import { sequelize } from '../infrastructure/postgre'
import { ConsoleLogger } from '../infrastructure/logger'

const logger = new ConsoleLogger()

export async function bootstrap() {
    logger.info('Syncing databases...')

    try {
        await sequelize.sync()
        logger.info('Database synced successfully')
    } catch (error) {
        logger.error(`Error syncing databases`, { error })
    }
}
