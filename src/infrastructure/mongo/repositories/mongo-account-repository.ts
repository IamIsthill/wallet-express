import { AccountModel, TransactionModel } from '../models'
import {
    Account,
    AccountRepository,
    Transaction,
} from '../../../domain/finance-management'
import { AccountMapper } from '../mappers'
import mongoose from 'mongoose'
import { CannotFindError } from '../../shared/errors'
import { NotImplementedError } from '../../../utils/errors'
import {
    DomainError,
    DatabaseError,
    UnknownDatabaseError,
} from '../../../utils/errors'
import { AccountNotFoundError } from '../../../application/shared/errors'
import { MongooseAccountDocumentPopulated } from '../types'

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
                AccountMapper.toTransaction(transaction)
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

    deleteTransaction(account: Account, transactionId: string): Promise<void> {
        throw new NotImplementedError()
    }

    async createTransaction(transaction: Transaction): Promise<Transaction> {
        try {
            const account = await AccountModel.findById(transaction.accountId)
            if (!account) {
                throw new AccountNotFoundError(transaction.accountId)
            }
            const lastTransaction = await TransactionModel.create({
                type: transaction.type,
                amount: transaction.amount,
                accountId: transaction.accountId,
            })
            account.transactions.push(lastTransaction._id)
            await account.save()

            return AccountMapper.toTransaction(lastTransaction)
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
    updateAccount(account: Account): Promise<Account> {
        throw new NotImplementedError()
    }
    getTransactionByTransactionId(
        transactionId: string
    ): Promise<Transaction | undefined> {
        throw new NotImplementedError()
    }

    updateTransaction(
        account: Account,
        updatedTransaction: Transaction
    ): Promise<Transaction> {
        throw new NotImplementedError()
    }
}
