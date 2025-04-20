import { MongoAccountRepository } from '../../../../infrastructure/mongo'
import {
    UpdateAccountService,
    UpdateAccountDto,
} from '../../../../application/finance-management'
import { NextFunction, Request, Response } from 'express'
import { codes } from '../../../../utils/lib'
import { ServiceError } from '../../../../utils/errors'
import { AccountNotFoundError } from '../../../../application/shared/errors'
import { NotFoundError, BadRequestError } from '../../errors'

const repo = new MongoAccountRepository()
const service = new UpdateAccountService(repo)

export const updateAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        request.body.accountId = request.params.accountId
        const dto = new UpdateAccountDto(request.body)
        const account = await service.use(dto)
        response.status(codes.OK).json(account)
    } catch (error: unknown) {
        if (error instanceof AccountNotFoundError) {
            next(new NotFoundError(error.message))
        } else if (error instanceof ServiceError) {
            next(new BadRequestError(error.message))
        }
        next(error)
    }
}
