import { AccountModel } from "../models";
import { Account, AccountRepository, Transaction } from "../../../domain/finance-management";
import { AccountMapper } from "../mappers/AccountMapper";
import mongoose from "mongoose";
import { DatabaseError, CannotFindError } from "../../shared/errors";

export class MongoAccountRepository implements AccountRepository {
    async createAccount(name: string, balance: number) {
        const mongooseAccount = await AccountModel.create({
            name: name,
            balance: balance,
            transactions: []
        })
        return AccountMapper.toAccount(mongooseAccount)
    }
    
    async findTransactionsByAccountId(accountId: string) {
        try {
            const mongooseAccount = await AccountModel.findById(accountId).lean()

            if(!mongooseAccount) {
                throw new CannotFindError()
            }
    
            return mongooseAccount.transactions.map(transaction => AccountMapper.toTransaction(transaction))
        } catch(err) {
            if(err instanceof mongoose.Error) {
                throw new DatabaseError(err.message)
            } 
            throw err
        }
  
    }
}