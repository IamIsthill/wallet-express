import {
    WithdrawFromAccountDto,
    WithdrawFromAccountService,
} from '../../../../application/finance-management'
import { NextFunction, Request, Response } from 'express'
import { PostgreUnitWork } from '../../../../infrastructure/postgre'
import { codes } from '../../../../utils/lib'
import { handleServiceError } from '../../errors'

export async function withdrawFromAccount(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        const unitWork = new PostgreUnitWork()
        await unitWork.transact(async () => {
            const { logger, body, params } = request
            const dto = WithdrawFromAccountDto.create({
                ...body,
                accountId: params.accountId,
            })
            logger.debug('Starting withdraw transaction', {
                accountId: dto.accountId,
                amount: dto.withdrawAmount,
            })

            const accountRepository = unitWork.getAccountRepository()
            const transactionRepository = unitWork.getTransactionRepository()

            const service = new WithdrawFromAccountService(
                accountRepository,
                transactionRepository
            )
            const withdrawTransaction = await service.use(dto)

            response.status(codes.CREATED).json(withdrawTransaction)
            logger.info('Withdraw successful', {
                transactionId: withdrawTransaction.id,
            })
        })
    } catch (error) {
        return handleServiceError(error, next)
    }
}
