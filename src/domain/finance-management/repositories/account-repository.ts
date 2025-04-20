import { Account } from '../aggregates'
import { Transaction } from '../entities'

export interface AccountRepository {
    createAccount(account: Account): Promise<Account>
    deleteAccount(accountId: string): Promise<void>
    getAccountByAccountId(accountId: string): Promise<Account | undefined>
    getAllAccounts(): Promise<Account[]>
    findTransactionsByAccountId(accountId: string): Promise<Transaction[]>
    save(account: Account): Promise<Account>
}
