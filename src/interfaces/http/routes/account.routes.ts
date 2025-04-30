import { Router } from 'express'
import * as controller from '../controllers/accounts'

export const accountRouter = Router()

accountRouter.post('/', controller.addAccount)
accountRouter.get('/:accountId', controller.getAccount)
accountRouter.delete('/:accountId', controller.deleteAccount)
accountRouter.patch('/:accountId', controller.updateAccount)
accountRouter.post('/:accountId/deposit', controller.depositToAccount)
accountRouter.get('/:accountId/transactions', controller.getAccountTransactions)
accountRouter.get(
    '/:accountId/transactions/:transactionId',
    controller.getTransaction
)
