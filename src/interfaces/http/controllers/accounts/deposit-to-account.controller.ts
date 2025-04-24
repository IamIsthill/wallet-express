import {
    DepositToAccountService,
    DepositToAccountDto,
} from '../../../../application/finance-management'
import { NextFunction, Request, Response } from 'express'
import { codes } from '../../../../utils/lib'
import { AccountNotFoundError } from '../../../../application/shared/errors'
import { ServiceError } from '../../../../utils/errors'
import { BadRequestError, NotFoundError } from '../../errors'
import {
    PostgreAccountRepository,
    PostgreTransactionRepository,
} from '../../../../infrastructure/postgre'

export const depositToAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const transactionRepo = new PostgreTransactionRepository()
        const accountRepo = new PostgreAccountRepository()
        const service = new DepositToAccountService(
            transactionRepo,
            accountRepo
        )

        request.body.accountId = request.params.accountId
        const dto = new DepositToAccountDto(request.body)
        const depositTransaction = await service.use(dto)
        response.status(codes.CREATED).json(depositTransaction)
    } catch (error: unknown) {
        if (error instanceof AccountNotFoundError) {
            next(new NotFoundError(error.message))
        } else if (error instanceof ServiceError) {
            next(new BadRequestError(error.message))
        } else {
            next(error)
        }
    }
}
