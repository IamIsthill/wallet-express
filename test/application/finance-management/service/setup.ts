import {
    AccountRepository,
    TransactionRepository,
} from '../../../../src/domain/finance-management'
import { vi } from 'vitest'

export const mockAccountRepository: AccountRepository = {
    createAccount: vi.fn(),
    findTransactionsByAccountId: vi.fn(),
    save: vi.fn(),
    deleteAccount: vi.fn(),
    getAccountByAccountId: vi.fn(),
    getAllAccounts: vi.fn(),
}

export const mockTransactionRepository: TransactionRepository = {
    save: vi.fn(),
    delete: vi.fn(),
    getById: vi.fn(),
}
