import {
    UpdateAccountService,
    UpdateAccountDto,
} from '../../../../application/finance-management'
import { NextFunction, Request, Response } from 'express'
import { codes } from '../../../../utils/lib'
import { PostgreAccountRepository } from '../../../../infrastructure/postgre'
import { handleServiceError } from '../../errors'

export const updateAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const repo = new PostgreAccountRepository()
        const service = new UpdateAccountService(repo)

        request.body.accountId = request.params.accountId
        const dto = new UpdateAccountDto(request.body)
        const account = await service.use(dto)
        response.status(codes.OK).json(account)
    } catch (error: unknown) {
        return handleServiceError(error, next)
    }
}
