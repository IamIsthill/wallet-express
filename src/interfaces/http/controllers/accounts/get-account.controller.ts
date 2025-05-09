import {
    GetAccountService,
    GetAccountDto,
} from '../../../../application/finance-management'
import { Response, Request, NextFunction } from 'express'
import { codes } from '../../../../utils/lib'
import { PostgreAccountRepository } from '../../../../infrastructure/postgre'
import { handleServiceError } from '../../errors'

export const getAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const repository = new PostgreAccountRepository()
        const service = new GetAccountService(repository)
        const dto = new GetAccountDto(request.params.accountId)
        const account = await service.use(dto)
        response.status(codes.OK).json(account)
    } catch (error) {
        return handleServiceError(error, next)
    }
}
