import {
    CreateAccountService,
    CreateAccountDto,
} from '../../../../application/finance-management'
import { MongoAccountRepository } from '../../../../infrastructure/mongo'
import { BadRequestError } from '../../errors'
import { ServiceError } from '../../../../utils/errors'
import { NextFunction, Request, Response } from 'express'
import { codes } from '../../../../utils/lib'

const repo = new MongoAccountRepository()
const service = new CreateAccountService(repo)

export const addAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const dto = new CreateAccountDto(request.body)
        const createdAccount = await service.use(dto)
        response.status(codes.CREATED).json(createdAccount)
    } catch (error: unknown) {
        if (error instanceof ServiceError) {
            next(new BadRequestError(error.message))
        }
        next(error)
    }
}
