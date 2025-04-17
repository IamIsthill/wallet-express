import { AccountModel } from "../models";
import { Account, AccountRepository, Transaction } from "../../../domain/finance-management";
import { AccountMapper } from "../mappers/AccountMapper";


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
        const mongooseAccount = await AccountModel.findById(accountId).lean()

        if(!mongooseAccount) {
            throw new Error('Failed to find any transaction')
        }
        const arr = mongooseAccount.transactions.map(transaction => AccountMapper.toTransaction(transaction))

        return arr
    }
}