import {
    DepositToAccountService,
    DepositToAccountDto,
} from '../../../../application/finance-management'
import { NextFunction, Request, Response } from 'express'
import { codes } from '../../../../utils/lib'
import { PostgreUnitWork } from '../../../../infrastructure/postgre'
import { handleServiceError } from '../../errors'

export const depositToAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const unitWork = new PostgreUnitWork()

        await unitWork.transact(async () => {
            const transactionRepo = unitWork.getTransactionRepository()
            const accountRepo = unitWork.getAccountRepository()
            const service = new DepositToAccountService(
                transactionRepo,
                accountRepo
            )
            request.body.accountId = request.params.accountId
            const dto = new DepositToAccountDto(request.body)
            const depositTransaction = await service.use(dto)
            response.status(codes.CREATED).json(depositTransaction)
        })
    } catch (error: unknown) {
        return handleServiceError(error, next)
    }
}
