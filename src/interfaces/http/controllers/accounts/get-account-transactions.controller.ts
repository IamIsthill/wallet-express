import { Response, Request, NextFunction } from 'express'
import {
    GetAccountTransactions,
    GetAccountTransactionsDto,
} from '../../../../application/finance-management'
import { PostgreAccountRepository } from '../../../../infrastructure/postgre'
import { codes } from '../../../../utils/lib'
import { AccountNotFoundError } from '../../../../application/shared/errors'
import { BadRequestError, NotFoundError } from '../../errors'
import { ServiceError } from '../../../../utils/errors'

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
        if (error instanceof AccountNotFoundError) {
            next(new NotFoundError(error.message))
        } else if (error instanceof ServiceError) {
            next(new BadRequestError(error.message))
        } else {
            next(error)
        }
    }
}
