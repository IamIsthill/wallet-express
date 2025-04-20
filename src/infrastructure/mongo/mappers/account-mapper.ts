import {
    MongooseAccountDocument,
    MongooseTransactionDocument,
    MongooseAccountDocumentPopulated,
} from '../types'
import {
    Account,
    Transaction,
    TransactionType,
    Amount,
    Balance,
} from '../../../domain/finance-management'

export const AccountMapper = {
    toAccount(mongooseAccount: MongooseAccountDocument) {
        const { _id, name, balance } = mongooseAccount
        const account = new Account(
            _id.toString(),
            name,
            Balance.create(balance)
        )

        return account
    },

    toAccountPopulated(mongooseAccount: MongooseAccountDocumentPopulated) {
        const { _id, name, balance, transactions } = mongooseAccount
        const account = new Account(
            _id.toString(),
            name,
            Balance.create(balance)
        )

        if (transactions.length > 0) {
            account.transactions = transactions.map((transaction) =>
                this.toTransaction(transaction)
            )
        }

        return account
    },

    toTransaction(mongooseTransaction: MongooseTransactionDocument) {
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
