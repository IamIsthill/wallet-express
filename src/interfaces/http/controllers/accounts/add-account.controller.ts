import { CreateAccountService, CreateAccountDto } from "../../../../application/finance-management";
import { ServiceError } from "../../../../application/shared/errors";
import { DomainError } from "../../../../domain/shared/errors";
import { MongoAccountRepository } from "../../../../infrastructure/mongo";
import { BadRequestError } from "../../errors";

import { NextFunction, Request, Response } from "express";
import { codes } from "../../../../utils/lib";


const repo = new MongoAccountRepository()
const service = new CreateAccountService(repo)

export const addAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = new CreateAccountDto(req.body.name, req.body.balance)
        const newAccount = await service.use(dto)
        res.status(codes.CREATED).json(newAccount) 
    } catch(err:any) {
        if(err instanceof ServiceError) {
            next(new BadRequestError(err.message))
        } 
        next(err)
    }
}

