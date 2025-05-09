import { Response, Request, NextFunction } from 'express'
import {
    GetAccountTransactions,
    GetAccountTransactionsDto,
} from '../../../../application/finance-management'
import { PostgreAccountRepository } from '../../../../infrastructure/postgre'
import { codes } from '../../../../utils/lib'
import { handleServiceError } from '../../errors'

export const getAccountTransactions = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const repo = new PostgreAccountRepository()
        const service = new GetAccountTransactions(repo)
        const dto = new GetAccountTransactionsDto({
            accountId: request.params.accountId,
        })

        const transactions = await service.use(dto)
        response.status(codes.OK).json(transactions)
    } catch (error) {
        return handleServiceError(error, next)
    }
}
