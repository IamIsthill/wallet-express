import {
    UnitOfWork,
    AccountRepository,
    TransactionRepository,
} from '../../../domain/finance-management'
import mongoose, { ClientSession } from 'mongoose'
import { DatabaseError } from '../../../utils/errors'
import { MongoAccountRepository } from './mongo-account-repository'
import { MongooseTransactionRepository } from './mongo-transaction-repository'

export class MongoUnitWork implements UnitOfWork {
    private session: ClientSession | undefined = undefined
    private accountRepository: AccountRepository | undefined = undefined
    private transactionRepository: TransactionRepository | undefined = undefined

    constructor(private readonly connection: mongoose.Connection) {}

    async commit(): Promise<void> {
        if (!this.isSessionActive()) {
            throw new DatabaseError('No active session to commit')
        }

        await this.session!.commitTransaction()
    }

    async endSession(): Promise<void> {
        if (this.isSessionActive()) {
            await this.session!.endSession()
            this.session = undefined
            this.accountRepository = undefined
            this.transactionRepository = undefined
        }
    }

    getTransactionRepository(): TransactionRepository {
        if (!this.isSessionActive()) {
            throw new DatabaseError(
                'Session not started.  Start a session before getting the repository.'
            )
        }
        this.transactionRepository =
            this.transactionRepository ||
            new MongooseTransactionRepository(this.connection, this.session!)
        return this.transactionRepository
    }

    getAccountRepository(): AccountRepository {
        if (!this.session) {
            throw new DatabaseError(
                'Session not started.  Start a session before getting the repository.'
            )
        }
        this.accountRepository =
            this.accountRepository ||
            new MongoAccountRepository(this.connection, this.session)
        return this.accountRepository
    }

    async rollback(): Promise<void> {
        if (!this.isSessionActive()) {
            throw new DatabaseError('No active session to rollback')
        }

        await this.session!.abortTransaction()
    }

    async startSession(): Promise<void> {
        if (this.session) {
            throw new DatabaseError('Session already started')
        }
        this.session = await this.connection.startSession()
        this.session.startTransaction()
    }

    private isSessionActive() {
        return this.session != undefined && this.session?.inTransaction()
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
            await this.endSession()
        }
    }
}
