import {
    GetTransactionService,
    GetTransactionDto,
} from '../../../../application/finance-management'
import { Response, Request, NextFunction } from 'express'
import { AccountNotFoundError } from '../../../../application/shared/errors'
import { BadRequestError, NotFoundError } from '../../errors'
import { ServiceError } from '../../../../utils/errors'
import { PostgreTransactionRepository } from '../../../../infrastructure/postgre'
import { codes } from '../../../../utils/lib'

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
        if (error instanceof AccountNotFoundError) {
            next(new NotFoundError(error.message))
        } else if (error instanceof ServiceError) {
            next(new BadRequestError(error.message))
        }
        next(error)
    }
}
