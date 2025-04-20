import { MongooseTransactionDocument } from '../types'
import {
    Transaction,
    TransactionType,
    Amount,
} from '../../../domain/finance-management'

export const TransactionMapper = {
    mapper(mongooseTransaction: MongooseTransactionDocument) {
        const amt = Amount.create(mongooseTransaction.amount)
        return new Transaction(
            mongooseTransaction._id.toString(),
            TransactionType._create(mongooseTransaction.type),
            amt,
            mongooseTransaction.accountId,
            mongooseTransaction.targetAccountId
        )
    },
}
