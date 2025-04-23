import {
    AccountRepository,
    TransactionRepository,
    UnitOfWork,
} from '../../../../src/domain/finance-management'
import { vi } from 'vitest'

export const mockAccountRepository: AccountRepository = {
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

export const mockUnitWork: UnitOfWork = {
    getAccountRepository: () => mockAccountRepository,
    commit: vi.fn(),
    endSession: vi.fn(),
    getTransactionRepository: () => mockTransactionRepository,
    rollback: vi.fn(),
    startSession: vi.fn(),
    transact: vi.fn(<T>(worker: (uow: UnitOfWork) => Promise<T>) => {
        return worker(mockUnitWork)
    }) as <T>(worker: (uow: UnitOfWork) => Promise<T>) => Promise<T>,
}
