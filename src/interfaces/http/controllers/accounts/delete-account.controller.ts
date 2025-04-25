import {
    DeleteAccountService,
    DeleteAccountDto,
} from '../../../../application/finance-management'
import { NextFunction, Request, Response } from 'express'
import { codes } from '../../../../utils/lib'
import { BadRequestError, NotFoundError } from '../../errors'
import { ServiceError } from '../../../../utils/errors'
import { AccountNotFoundError } from '../../../../application/shared/errors'
import { PostgreAccountRepository } from '../../../../infrastructure/postgre'

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
        if (error instanceof AccountNotFoundError) {
            next(new NotFoundError(error.message))
        } else if (error instanceof ServiceError) {
            next(new BadRequestError(error.message))
        }
        next(error)
    }
}
