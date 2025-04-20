import {
    DepositToAccountService,
    DepositToAccountDto,
} from '../../../../application/finance-management'
import { NextFunction, Request, Response } from 'express'
import { MongoAccountRepository } from '../../../../infrastructure/mongo'
import { codes } from '../../../../utils/lib'
import { AccountNotFoundError } from '../../../../application/shared/errors'
import { ServiceError } from '../../../../utils/errors'
import { BadRequestError, NotFoundError } from '../../errors'

const repo = new MongoAccountRepository()
const service = new DepositToAccountService(repo)

export const depositToAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const dto = new DepositToAccountDto(
            request.params.accountId,
            request.body.depositAmount
        )
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
