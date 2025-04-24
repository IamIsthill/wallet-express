import { Account } from '../aggregates'
import { Transaction } from '../entities'

export interface AccountRepository {
    deleteAccount(accountId: string): Promise<void>
    getById(
        accountId: string,
        options?: { hydrate?: boolean }
    ): Promise<Account | undefined>
    getAllAccounts(): Promise<Account[]>
    findTransactionsByAccountId(accountId: string): Promise<Transaction[]>
    save(account: Account): Promise<Account>
}
