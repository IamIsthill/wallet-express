import { Request, Response, NextFunction } from 'express'
import { CreateAccountDto } from '../../../../application/account/dto'
import { container } from '../../../../config/container'


export const addAccount = async(request:Request, response: Response, next: NextFunction) => {
    try {
        const {name, balance} = request.body
        // Validation here
        const createAccountDto = new CreateAccountDto(name, balance)
        const newAccount = await container.accountService.addAccount.run(createAccountDto)
        response.status(201).json(newAccount)
        return 
    } catch (err: unknown) {
        next(err)
    }
}