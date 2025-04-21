import {
    GetAccountService,
    GetAccountDto,
} from '../../../../application/finance-management'
import { MongoUnitWork } from '../../../../infrastructure/mongo'
import { Response, Request, NextFunction } from 'express'
import { codes } from '../../../../utils/lib'
import { AccountNotFoundError } from '../../../../application/shared/errors'
import { BadRequestError, NotFoundError } from '../../errors'
import { ServiceError } from '../../../../utils/errors'
import mongoose from 'mongoose'

export const getAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const unitWork = new MongoUnitWork(mongoose.connection)

    try {
        await unitWork.startSession()
        const service = new GetAccountService(unitWork.getAccountRepository())
        const dto = new GetAccountDto(request.params.accountId)
        const account = await service.use(dto)
        await unitWork.commit()
        response.status(codes.OK).json(account)
    } catch (error) {
        await unitWork.rollback()
        if (error instanceof AccountNotFoundError) {
            next(new NotFoundError(error.message))
        } else if (error instanceof ServiceError) {
            next(new BadRequestError(error.message))
        } else {
            next(error)
        }
    } finally {
        await unitWork.endSession()
    }
}
