import { Account } from '../aggregates'
import { Transaction } from '../entities'

export interface TransactionRepository {
    updateTransaction(
        account: Account,
        updatedTransaction: Transaction
    ): Promise<Transaction>
    deleteTransaction(account: Account, transactionId: string): Promise<void>
    createTransaction(transaction: Transaction): Promise<Transaction>
    getTransactionById(transactionId: string): Promise<Transaction | undefined>
}
