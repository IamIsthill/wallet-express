import { AccountRepository } from './account-repository'
import { TransactionRepository } from './transaction-repository'

export interface UnitOfWork {
    startSession(): Promise<void>
    commit(): Promise<void>
    rollback(): Promise<void>
    endSession(): Promise<void>
    getAccountRepository(): AccountRepository
    getTransactionRepository(): TransactionRepository
    transact<T>(worker: (uow: UnitOfWork) => Promise<T>): Promise<T>
}
