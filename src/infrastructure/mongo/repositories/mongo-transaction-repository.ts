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
import { MongooseTransactionDocument } from '../types'

export class MongooseTransactionRepository implements TransactionRepository {
    constructor(
        private readonly connection: mongoose.Connection,
        private readonly session: mongoose.ClientSession
    ) {}
    delete(account: Account, transactionId: string): Promise<void> {
        throw new NotImplementedError()
    }
    getById(transactionId: string): Promise<Transaction | undefined> {
        throw new NotImplementedError()
    }

    async save(transaction: Transaction): Promise<Transaction> {
        try {
            const existingTransaction = await TransactionModel.findById(
                transaction.id,
                null,
                { session: this.session }
            )

            let persistedTransaction: MongooseTransactionDocument

            if (existingTransaction) {
                existingTransaction.accountId = transaction.accountId
                existingTransaction.targetAccountId =
                    transaction.targetAccountId
                existingTransaction.type = transaction.type.value
                existingTransaction.amount = transaction.amount.value
                await existingTransaction.save({ session: this.session })
                persistedTransaction = existingTransaction
            } else {
                const newTransaction = new TransactionModel({
                    accountId: transaction.accountId,
                    targetAccountId: transaction.targetAccountId,
                    type: transaction.type.value,
                    amount: transaction.amount.value,
                })
                await newTransaction.save({ session: this.session })
                persistedTransaction = newTransaction
            }
            return TransactionMapper.mapper(persistedTransaction)
        } catch (err) {
            if (err instanceof mongoose.Error || err instanceof DomainError) {
                throw new DatabaseError(err.message, { cause: err })
            }
            throw new UnknownDatabaseError(err)
        }
    }
}
