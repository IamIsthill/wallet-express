import {
    Account,
    Transaction,
    TransactionRepository,
} from '../../../domain/finance-management'
import {
    NotImplementedError,
    DomainError,
    DatabaseError,
    UnknownDatabaseError,
} from '../../../utils/errors'
import { AccountNotFoundError } from '../../../application/shared/errors'
import { TransactionMapper } from '../mappers'
import { AccountModel, TransactionModel } from '../models'
import mongoose from 'mongoose'

export class MongooseTransactionRepository implements TransactionRepository {
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

            return TransactionMapper.mapper(lastTransaction)
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
    deleteTransaction(account: Account, transactionId: string): Promise<void> {
        throw new NotImplementedError()
    }
    updateTransaction(
        account: Account,
        updatedTransaction: Transaction
    ): Promise<Transaction> {
        throw new NotImplementedError()
    }
    getTransactionById(
        transactionId: string
    ): Promise<Transaction | undefined> {
        throw new NotImplementedError()
    }
}
