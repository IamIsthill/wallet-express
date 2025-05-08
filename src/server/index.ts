import { createServer } from 'node:http'
import { createApp } from './app'
import { bootstrap } from './bootstrap'
import { ENVIRONMENT } from '../config'
import { ConsoleLogger } from '../infrastructure/logger'

const logger = new ConsoleLogger()

async function startApp() {
    try {
        await bootstrap()

        const app = createApp()
        const server = createServer(app)

        server.listen(ENVIRONMENT.PORT, () => {
            logger.info(`Wallet Server listening on port ${ENVIRONMENT.PORT}`)
        })

        const shutdown = () => {
            logger.info('Starting graceful shutdown...')
            server.close(() => {
                logger.info('Server closed successfully')
            })
        }

        //OS sends signal for app to end
        process.on('SIGTERM', shutdown)
        process.on('SIGINT', shutdown)
    } catch (error) {
        // Automatically terminate sessionif app failed to start
        logger.error('Failed to start application', { error })
    }
}

startApp()

// Top Level Error catcher
process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', { reason })
})
