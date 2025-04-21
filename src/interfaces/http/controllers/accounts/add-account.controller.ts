import {
    CreateAccountService,
    CreateAccountDto,
} from '../../../../application/finance-management'
import { BadRequestError } from '../../errors'
import { ServiceError } from '../../../../utils/errors'
import { NextFunction, Request, Response } from 'express'
import { codes } from '../../../../utils/lib'
import { MongoUnitWork } from '../../../../infrastructure/mongo'
import mongoose from 'mongoose'

export const addAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const unitWork = new MongoUnitWork(mongoose.connection)
    try {
        await unitWork.startSession()
        const service = new CreateAccountService(
            unitWork.getAccountRepository()
        )
        const dto = new CreateAccountDto(request.body)
        const createdAccount = await service.use(dto)
        await unitWork.commit()
        response.status(codes.CREATED).json(createdAccount)
    } catch (error: unknown) {
        await unitWork.rollback()
        if (error instanceof ServiceError) {
            next(new BadRequestError(error.message))
        }
        next(error)
    } finally {
        await unitWork.endSession()
    }
}
