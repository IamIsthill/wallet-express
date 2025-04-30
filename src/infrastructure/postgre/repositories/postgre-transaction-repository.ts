import {
    Account,
    Transaction,
    TransactionRepository,
} from '../../../domain/finance-management'
import { TransactionModel } from '../models'
import { Transaction as T, BaseError } from 'sequelize'
import { NotImplementedError } from '../../../utils/errors'
import { TransactionMapper } from '../mappers'
import '../models/associations'
import {
    DomainError,
    DatabaseError,
    UnknownDatabaseError,
} from '../../../utils/errors'

export class PostgreTransactionRepository implements TransactionRepository {
    private readonly transaction: T | undefined = undefined

    constructor(transaction?: T | undefined) {
        this.transaction = transaction
    }

    async delete(account: Account, transactionId: string): Promise<void> {
        throw new NotImplementedError()
    }
    async getById(transactionId: string): Promise<Transaction | undefined> {
        try {
            const transaction = await TransactionModel.findByPk(transactionId)

            if (!transaction) {
                return undefined
            }

            return TransactionMapper.toTransaction(transaction)
        } catch (error) {
            if (error instanceof DomainError || error instanceof BaseError) {
                throw new DatabaseError(error.message, { cause: error })
            }
            throw new UnknownDatabaseError(error)
        }
    }
    async save(transaction: Transaction): Promise<Transaction> {
        try {
            const { accountId, type, targetAccountId, amount, id } = transaction
            const existingTransaction = await TransactionModel.findByPk(id)

            let persistedTransaction: TransactionModel

            if (existingTransaction) {
                existingTransaction.accountId = accountId
                existingTransaction.type = type.value
                existingTransaction.targetAccountId = targetAccountId
                existingTransaction.amount = amount.value
                await existingTransaction.save({
                    transaction: this.transaction,
                })
                persistedTransaction = existingTransaction
            } else {
                const createdTransaction = await TransactionModel.create(
                    {
                        accountId: accountId,
                        targetAccountId: targetAccountId,
                        type: type.value,
                        amount: amount.value,
                    },
                    { transaction: this.transaction }
                )
                persistedTransaction = createdTransaction
            }

            return TransactionMapper.toTransaction(persistedTransaction)
        } catch (error) {
            if (error instanceof DomainError || error instanceof BaseError) {
                throw new DatabaseError(error.message, { cause: error })
            }
            throw new UnknownDatabaseError(error)
        }
    }
}
