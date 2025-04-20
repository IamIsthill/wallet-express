import { AccountRepository } from '../../../../src/domain/finance-management'
import { vi } from 'vitest'

export const mockAccountRepository: AccountRepository = {
    createAccount: vi.fn(),
    findTransactionsByAccountId: vi.fn(),
    updateAccount: vi.fn(),
    deleteAccount: vi.fn(),
    deleteTransaction: vi.fn(),
    getAccountByAccountId: vi.fn(),
    getAllAccounts: vi.fn(),
    getTransactionByTransactionId: vi.fn(),
    updateTransaction: vi.fn(),
    createTransaction: vi.fn(),
}
