import {
    GetAccountService,
    GetAccountDto,
} from '../../../../application/finance-management'
import { Response, Request, NextFunction } from 'express'
import { codes } from '../../../../utils/lib'
import { AccountNotFoundError } from '../../../../application/shared/errors'
import { BadRequestError, NotFoundError } from '../../errors'
import { ServiceError } from '../../../../utils/errors'
import { PostgreAccountRepository } from '../../../../infrastructure/postgre'

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
        if (error instanceof AccountNotFoundError) {
            next(new NotFoundError(error.message))
        } else if (error instanceof ServiceError) {
            next(new BadRequestError(error.message))
        } else {
            next(error)
        }
    }
}
