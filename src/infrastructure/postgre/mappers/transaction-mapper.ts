import {
    Transaction,
    Amount,
    TransactionType,
} from '../../../domain/finance-management'
// import { ITransactionModel } from '../interface'
import { TransactionModel } from '../models'

export const TransactionMapper = {
    toTransaction(model: TransactionModel) {
        const { id, type, amount, accountId, targetAccountId } = model

        const transaction = new Transaction(
            id,
            TransactionType._create(type),
            Amount.create(amount),
            accountId,
            targetAccountId || undefined
        )

        return transaction
    },
}
