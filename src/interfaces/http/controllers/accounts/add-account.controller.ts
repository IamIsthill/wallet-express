import { CreateAccountService, CreateAccountDto } from "../../../../application/finance-management";
import { MongoAccountRepository } from "../../../../infrastructure/mongo";
import { async } from "../../../../utils/lib";
import { Request, Response } from "express";

const repo = new MongoAccountRepository()
const service = new CreateAccountService(repo)

export const addAccount = async(async (req: Request, res: Response) => {
    const dto = new CreateAccountDto(req.body.name, req.body.balance)
    const newAccount = service.use(dto)
    res.status(201).json(newAccount)
})