import { AccountModel } from '../models'
import { Account, AccountRepository } from '../../../domain/finance-management'
import { AccountMapper, TransactionMapper } from '../mappers'
import mongoose from 'mongoose'
import { CannotFindError } from '../../shared/errors'
import { NotImplementedError } from '../../../utils/errors'
import {
    DomainError,
    DatabaseError,
    UnknownDatabaseError,
} from '../../../utils/errors'
import {
    MongooseAccountDocument,
    MongooseAccountDocumentPopulated,
} from '../types'

export class MongoAccountRepository implements AccountRepository {
    async createAccount(account: Account) {
        try {
            const mongooseAccount = await AccountModel.create({
                name: account.name,
                balance: account.balance.value,
                transactions: [],
            })
            return AccountMapper.toAccount(mongooseAccount)
        } catch (error) {
            if (
                error instanceof mongoose.Error ||
                error instanceof DomainError
            ) {
                throw new DatabaseError(error.message, { cause: error })
            }
            throw new UnknownDatabaseError(error)
        }
    }

    async findTransactionsByAccountId(accountId: string) {
        try {
            const mongooseAccount = (await AccountModel.findById(
                accountId
            ).populate(
                'transactions'
            )) as MongooseAccountDocumentPopulated | null

            if (!mongooseAccount) {
                throw new CannotFindError()
            }

            return mongooseAccount.transactions.map((transaction) =>
                TransactionMapper.mapper(transaction)
            )
        } catch (error) {
            if (
                error instanceof mongoose.Error ||
                error instanceof DomainError
            ) {
                throw new DatabaseError(error.message, { cause: error })
            }
            throw error
        }
    }

    async deleteAccount(accountId: string): Promise<void> {
        throw new NotImplementedError()
    }

    async getAccountByAccountId(
        accountId: string
    ): Promise<Account | undefined> {
        try {
            const account = await AccountModel.findById(accountId).lean()

            if (!account) return undefined

            return AccountMapper.toAccount(account)
        } catch (error) {
            if (
                error instanceof mongoose.Error ||
                error instanceof DomainError
            ) {
                throw new DatabaseError(error.message, { cause: error })
            }
            throw new UnknownDatabaseError(error)
        }
    }

    getAllAccounts(): Promise<Account[]> {
        throw new NotImplementedError()
    }

    async save(account: Account): Promise<Account> {
        try {
            const existingAccount = await AccountModel.findById(account.id)

            let persistedAccount: MongooseAccountDocument

            if (existingAccount) {
                existingAccount.name = account.name
                existingAccount.balance = account.balance.value
                existingAccount.transactions = account.transactions.map(
                    (transaction) =>
                        new mongoose.Types.ObjectId(transaction.id!)
                )
                await existingAccount.save()
                persistedAccount = existingAccount
            } else {
                const newAccount = new AccountModel({
                    name: account.name,
                    balance: account.balance.value,
                    transactions: account.transactions.map(
                        (transaction) =>
                            new mongoose.Types.ObjectId(transaction.id!)
                    ),
                })
                await newAccount.save()
                persistedAccount = newAccount
            }

            return AccountMapper.toAccount(persistedAccount)
        } catch (error: unknown) {
            if (
                error instanceof mongoose.Error ||
                error instanceof DomainError
            ) {
                throw new DatabaseError(error.message, { cause: error })
            }
            throw new UnknownDatabaseError(error)
        }
    }
}
