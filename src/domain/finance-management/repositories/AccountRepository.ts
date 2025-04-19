import { Account } from "../aggregates"
import { Transaction } from "../entities"

export interface AccountRepository {
    createAccount(account: Account): Promise<Account>
    deleteAccount(accountId: string): Promise<void>
    updateAccount(account:Account): Promise<Account>
    getAccountByAccountId(accountId: string): Promise<Account | undefined>
    getAllAccounts(): Promise<Account[]>
    findTransactionsByAccountId(accountId: string): Promise<Transaction[]>
    getTransactionByTransactionId(transactionId: string): Promise<Transaction | undefined>
    updateTransaction(account: Account, updatedTransaction: Transaction): Promise<Transaction>
    deleteTransaction(account: Account, transactionId: string): Promise<void>
}