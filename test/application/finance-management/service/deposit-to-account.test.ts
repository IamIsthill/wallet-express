import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import {
    DepositToAccountService,
    DepositToAccountDto,
    DepositToTransactionResponseDto,
} from '../../../../src/application/finance-management'
import { mockAccountRepository } from './setup'
import {
    Account,
    Balance,
    Transaction,
    TransactionType,
    Amount,
} from '../../../../src/domain/finance-management'
import { AccountNotFoundError } from '../../../../src/application/shared/errors'
import {
    DatabaseError,
    DomainError,
    ServiceError,
    UnknownServiceError,
} from '../../../../src/utils/errors'

describe('DepositToAccountService', () => {
    let depositToAccountService: DepositToAccountService

    beforeEach(() => {
        vi.clearAllMocks()
        depositToAccountService = new DepositToAccountService(
            mockAccountRepository
        )
    })

    it('should correctly increase the balance', async () => {
        const depositDto = new DepositToAccountDto('account-id', 100)
        const mockAccount = new Account(
            'account-id',
            'Savings Account',
            Balance.create(100)
        )
        const mockTransaction = new Transaction(
            'transaction-id',
            TransactionType.income(),
            Amount.create(200),
            'account-id'
        )
        ;(
            mockAccountRepository.getAccountByAccountId as Mock
        ).mockResolvedValue(mockAccount)
        ;(mockAccountRepository.createTransaction as Mock).mockResolvedValue(
            mockTransaction
        )

        const response = await depositToAccountService.use(depositDto)

        expect(mockAccountRepository.createTransaction).toHaveBeenCalledWith({
            id: undefined,
            type: { value: 'income' },
            amount: { _value: 100 },
            accountId: 'account-id',
            targetAccountId: undefined,
        })
        expect(response).toBeInstanceOf(DepositToTransactionResponseDto)
        expect(response).toStrictEqual(
            expect.objectContaining({
                accountId: 'account-id',
                id: 'transaction-id',
                targetAccountId: undefined,
                type: 'income',
                amount: 200,
            })
        )
    })

    it('should throw an AccountNotFoundError when no account to deposit to is found', async () => {
        const depositDto = new DepositToAccountDto('not-existing-account', 100)
        const mockReturn = undefined
        ;(
            mockAccountRepository.getAccountByAccountId as Mock
        ).mockResolvedValue(mockReturn)

        await expect(depositToAccountService.use(depositDto)).rejects.toThrow(
            AccountNotFoundError
        )
    })

    it('should throw a ServiceError wrapping the DatabaseError from the repository', async () => {
        const dto = new DepositToAccountDto('account-id', 100)
        const mockAccount = new Account(
            'account-id',
            'Savings Account',
            Balance.create(100)
        )
        const databaseError = new DatabaseError('Something went wrong')
        ;(
            mockAccountRepository.getAccountByAccountId as Mock
        ).mockResolvedValue(mockAccount)
        ;(mockAccountRepository.createTransaction as Mock).mockRejectedValue(
            databaseError
        )

        await expect(depositToAccountService.use(dto)).rejects.toThrow(
            ServiceError
        )
        await expect(depositToAccountService.use(dto)).rejects.toHaveProperty(
            'cause',
            databaseError
        )
    })

    it('should throw a ServiceError wrapping the DomainError from the repository', async () => {
        const dto = new DepositToAccountDto('account-id', 100)
        const mockAccount = new Account(
            'account-id',
            'Savings Account',
            Balance.create(100)
        )
        const error = new DomainError('Something went wrong')
        ;(
            mockAccountRepository.getAccountByAccountId as Mock
        ).mockResolvedValue(mockAccount)
        ;(mockAccountRepository.createTransaction as Mock).mockRejectedValue(
            error
        )

        await expect(depositToAccountService.use(dto)).rejects.toThrow(
            ServiceError
        )
        await expect(depositToAccountService.use(dto)).rejects.toHaveProperty(
            'cause',
            error
        )
    })

    it('should throw an UnknownServiceError wrapping other unexpected errors from the repository', async () => {
        const dto = new DepositToAccountDto('account-id', 100)
        const mockAccount = new Account(
            'account-id',
            'Savings Account',
            Balance.create(100)
        )
        const error = new Error('Something went wrong')
        ;(
            mockAccountRepository.getAccountByAccountId as Mock
        ).mockResolvedValue(mockAccount)
        ;(mockAccountRepository.createTransaction as Mock).mockRejectedValue(
            error
        )

        await expect(depositToAccountService.use(dto)).rejects.toThrow(
            UnknownServiceError
        )
        await expect(depositToAccountService.use(dto)).rejects.toHaveProperty(
            'cause',
            error
        )
    })
})
