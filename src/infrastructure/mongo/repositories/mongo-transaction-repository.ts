import {
    Account,
    Transaction,
    TransactionRepository,
} from '../../../domain/finance-management'
import { NotImplementedError } from '../../../utils/errors'

export class MongooseTransactionRepository implements TransactionRepository {
    createTransaction(transaction: Transaction): Promise<Transaction> {
        throw new NotImplementedError()
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
