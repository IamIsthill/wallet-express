import { Account } from '../aggregates'
import { Transaction } from '../entities'

export interface TransactionRepository {
    delete(account: Account, transactionId: string): Promise<void>
    getById(transactionId: string): Promise<Transaction | undefined>
    save(transaction: Transaction): Promise<Transaction>
}
