import {
    GetTransactionService,
    GetTransactionDto,
} from '../../../../application/finance-management'
import { Response, Request, NextFunction } from 'express'
import { PostgreTransactionRepository } from '../../../../infrastructure/postgre'
import { codes } from '../../../../utils/lib'
import { handleServiceError } from '../../errors'

export const getTransaction = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const repo = new PostgreTransactionRepository()
        const service = new GetTransactionService(repo)
        const dto = new GetTransactionDto({
            transactionId: request.params.transactionId,
            accountId: request.params.accountId,
        })
        const result = await service.use(dto)
        response.status(codes.OK).json(result)
    } catch (error) {
        return handleServiceError(error, next)
    }
}
