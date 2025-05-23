import { Account, Balance } from '../../../domain/finance-management'
import { AccountModel } from '../models'

export const AccountMapper = {
    toAccount(model: AccountModel) {
        const account = new Account(
            model.id,
            model.name,
            Balance.create(Number(model.balance))
        )
        const transactions = model.transactions.map((tx) => tx.id)

        account.setTransactions(transactions)

        return account
    },
}
