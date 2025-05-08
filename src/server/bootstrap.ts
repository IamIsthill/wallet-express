import { sequelize } from '../infrastructure/postgre'
import { logger } from '../infrastructure/logger'

export async function bootstrap() {
    logger.info('Syncing databases...')

    try {
        await sequelize.sync()
        logger.info('Database synced successfully')
    } catch (error) {
        logger.error(`Error syncing databases`, { error })
    }
}
