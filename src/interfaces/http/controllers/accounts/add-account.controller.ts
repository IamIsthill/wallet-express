import {
    CreateAccountService,
    CreateAccountDto,
} from '../../../../application/finance-management'
import { NextFunction, Request, Response } from 'express'
import { codes } from '../../../../utils/lib'
import { PostgreUnitWork } from '../../../../infrastructure/postgre'
import { handleServiceError } from '../../errors'

export const addAccount = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const unitWork = new PostgreUnitWork()
        const service = new CreateAccountService(unitWork)
        const dto = new CreateAccountDto(request.body)
        const createdAccount = await service.use(dto)
        response.status(codes.CREATED).json(createdAccount)
    } catch (error: unknown) {
        return handleServiceError(error, next)
    }
}
