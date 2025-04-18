import { AccountModel } from "../models";
import { Account, AccountRepository, Transaction } from "../../../domain/finance-management";
import { AccountMapper } from "../mappers/AccountMapper";
import mongoose from "mongoose";
import { DatabaseError, CannotFindError } from "../../shared/errors";
import { DomainError } from "../../../domain/shared/errors";
import { NotImplemented } from "../../../utils/errors";

export class MongoAccountRepository implements AccountRepository {
    async createAccount(name: string, balance: number) {
        try {
            const mongooseAccount = await AccountModel.create({
                name: name,
                balance: balance,
                transactions: []
            })
            return AccountMapper.toAccount(mongooseAccount)
        } catch(err) {
            if(err instanceof mongoose.Error || err instanceof DomainError ) {
                throw new DatabaseError(err.message, {cause: err})
            }
            throw err
        }
    }
    
    async findTransactionsByAccountId(accountId: string) {
        try {
            const mongooseAccount = await AccountModel.findById(accountId).lean()

            if(!mongooseAccount) {
                throw new CannotFindError()
            }
    
            return mongooseAccount.transactions.map(transaction => AccountMapper.toTransaction(transaction))
        } catch(err) {
            if(err instanceof mongoose.Error || err instanceof DomainError ) {
                throw new DatabaseError(err.message, {cause: err})
            } 
            throw err
        }
  
    }

    async deleteAccount(accountId: string): Promise<void> {
        throw new NotImplemented()
    }

    deleteTransaction(account: Account, transactionId: string): Promise<void> {
        throw new NotImplemented()
    } 

    getAccountByAccountId(accountId: string): Promise<Account | undefined> {
        throw new NotImplemented()
        
    }
    getAllAccounts(): Promise<Account[]> {
        throw new NotImplemented()
    }
    updateAccount(account: Account): Promise<Account> {
        throw new NotImplemented() 
    }
    getTransactionByTransactionId(transactionId: string): Promise<Transaction | undefined> {
        throw new NotImplemented()
        
    }
    updateTransaction(account: Account, updatedTransaction: Transaction): Promise<Transaction> {
        throw new NotImplemented()
    }
}
