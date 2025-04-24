import {
    MongooseAccountDocument,
    MongooseAccountDocumentPopulated,
} from '../types'
import { Account, Balance } from '../../../domain/finance-management'
import { TransactionMapper } from './transaction-mapper'

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
            account.setTransactions(
                transactions.map((transaction) =>
                    TransactionMapper.mapper(transaction)
                )
            )
        }

        return account
    },
}
