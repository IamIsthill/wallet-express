import {
    DeleteAccountService,
    DeleteAccountDto,
} from '../../../../application/finance-management'
import { NextFunction, Request, Response } from 'express'
import { codes } from '../../../../utils/lib'
import { PostgreAccountRepository } from '../../../../infrastructure/postgre'
import { handleServiceError } from '../../errors'

export const deleteAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const dto = new DeleteAccountDto({
            accountId: request.params.accountId,
        })
        const repo = new PostgreAccountRepository()
        const service = new DeleteAccountService(repo)

        await service.use(dto)
        response.sendStatus(codes.NO_CONTENT)
    } catch (error) {
        return handleServiceError(error, next)
    }
}
