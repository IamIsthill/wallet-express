import {
    DepositToAccountService,
    DepositToAccountDto,
} from '../../../../application/finance-management'
import { NextFunction, Request, Response } from 'express'
import { codes } from '../../../../utils/lib'
import { AccountNotFoundError } from '../../../../application/shared/errors'
import { ServiceError } from '../../../../utils/errors'
import { BadRequestError, NotFoundError } from '../../errors'
import { MongoUnitWork } from '../../../../infrastructure/mongo'
import mongoose from 'mongoose'

export const depositToAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const unitWork = new MongoUnitWork(mongoose.connection)

    try {
        unitWork.startSession()
        const transactionRepo = unitWork.getTransactionRepository()
        const accountRepo = unitWork.getAccountRepository()
        const service = new DepositToAccountService(
            transactionRepo,
            accountRepo
        )

        request.body.accountId = request.params.accountId
        const dto = new DepositToAccountDto(request.body)
        const depositTransaction = await service.use(dto)
        await unitWork.commit()
        response.status(codes.CREATED).json(depositTransaction)
    } catch (error: unknown) {
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
