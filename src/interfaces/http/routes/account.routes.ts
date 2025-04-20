import { Router } from 'express'
import * as controller from '../controllers/accounts'

export const accountRouter = Router()

accountRouter.post('/', controller.addAccount)
accountRouter.get('/:accountId', controller.getAccount)
