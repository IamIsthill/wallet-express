import {
    AccountRepository,
    TransactionRepository,
} from '../../../../src/domain/finance-management'
import { vi } from 'vitest'

export const mockAccountRepository: AccountRepository = {
    createAccount: vi.fn(),
    findTransactionsByAccountId: vi.fn(),
    updateAccount: vi.fn(),
    deleteAccount: vi.fn(),
    getAccountByAccountId: vi.fn(),
    getAllAccounts: vi.fn(),
}

export const mockTransactionRepository: TransactionRepository = {
    createTransaction: vi.fn(),
    deleteTransaction: vi.fn(),
    getTransactionById: vi.fn(),
    updateTransaction: vi.fn(),
}
