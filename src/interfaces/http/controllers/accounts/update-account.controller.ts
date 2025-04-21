import { MongoUnitWork } from '../../../../infrastructure/mongo'
import {
    UpdateAccountService,
    UpdateAccountDto,
} from '../../../../application/finance-management'
import { NextFunction, Request, Response } from 'express'
import { codes } from '../../../../utils/lib'
import { ServiceError } from '../../../../utils/errors'
import { AccountNotFoundError } from '../../../../application/shared/errors'
import { NotFoundError, BadRequestError } from '../../errors'
import mongoose from 'mongoose'

export const updateAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const unitWork = new MongoUnitWork(mongoose.connection)
    const service = new UpdateAccountService(unitWork.getAccountRepository())
    try {
        await unitWork.startSession()
        request.body.accountId = request.params.accountId
        const dto = new UpdateAccountDto(request.body)
        const account = await service.use(dto)
        await unitWork.commit()
        response.status(codes.OK).json(account)
    } catch (error: unknown) {
        await unitWork.rollback()
        if (error instanceof AccountNotFoundError) {
            next(new NotFoundError(error.message))
        } else if (error instanceof ServiceError) {
            next(new BadRequestError(error.message))
        }
        next(error)
    } finally {
        await unitWork.endSession()
    }
}
