import {
    AccountRepository,
    TransactionRepository,
    UnitOfWork,
} from '../../../domain/finance-management'
import { Transaction } from 'sequelize'
import { DatabaseError } from '../../../utils/errors'
import { PostgreAccountRepository } from './postgre-account-repository'
import { Sequelize } from 'sequelize'
import { PostgreTransactionRepository } from './postgre-transaction-repository'

export class PostgreUnitWork implements UnitOfWork {
    private accountRepository: AccountRepository | undefined = undefined
    private transactionRepository: TransactionRepository | undefined = undefined
    private transaction: Transaction | undefined = undefined

    constructor(private readonly sequelize: Sequelize) {}

    async commit(): Promise<void> {
        this.isTransactionActive()
        await this.transaction!.commit()
    }

    async endSession(): Promise<void> {
        if (this.transaction) {
            this.transaction = undefined
            this.accountRepository = undefined
            this.transactionRepository = undefined
        }
    }

    async rollback(): Promise<void> {
        this.isTransactionActive()
        await this.transaction!.rollback()
    }

    async startSession(): Promise<void> {
        this.transaction = await this.sequelize.transaction()
        this.accountRepository = new PostgreAccountRepository(this.transaction)
        this.transactionRepository = new PostgreTransactionRepository(
            this.transaction
        )
    }

    async transact<T>(worker: (uow: this) => Promise<T>): Promise<T> {
        try {
            await this.startSession()
            const results = await worker(this)
            await this.commit()
            return results
        } catch (error) {
            await this.rollback()
            throw error
        } finally {
            this.endSession()
        }
    }
    getAccountRepository(): AccountRepository {
        this.isTransactionActive()

        if (!this.accountRepository) {
            throw new DatabaseError('Define account repository')
        }
        return this.accountRepository
    }
    getTransactionRepository(): TransactionRepository {
        this.isTransactionActive()
        if (!this.transactionRepository) {
            throw new DatabaseError('Define account repository')
        }
        return this.transactionRepository
    }

    private isTransactionActive() {
        // Check if transaction was already set
        if (!this.transaction) {
            throw new DatabaseError('Start session first')
        }
    }
}
