import { WithdrawFromAccountService } from './withdraw-from-account.service'
import {
    WithdrawFromAccountDto,
    WithdrawFromAccountResponseDto,
} from './withdraw-from-account.dto'
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest'
import {
    mockAccountRepository,
    mockTransactionRepository,
} from '../../../../../test/mocks'
import {
    Account,
    Balance,
    Transaction,
    TransactionType,
    Amount,
} from '../../../../domain/finance-management'
import { randomUUID } from 'node:crypto'
import { AccountNotFoundError } from '../../../shared/errors'
import {
    DatabaseError,
    DomainError,
    ServiceError,
    UnknownServiceError,
} from '../../../../utils/errors'

describe('WithdrawFromAccountService', () => {
    let service: WithdrawFromAccountService
    let mockAccount: Account
    let mockTransaction: Transaction
    let dto: WithdrawFromAccountDto
    const mockAccountId = randomUUID()
    const mockTransactionId = 'tx-id'

    beforeEach(() => {
        vi.clearAllMocks()
        service = new WithdrawFromAccountService(
            mockAccountRepository,
            mockTransactionRepository
        )
        mockAccount = new Account(mockAccountId, 'Savings', Balance.create(200))
        mockTransaction = Transaction.create(
            mockTransactionId,
            TransactionType.expense(),
            Amount.create(100),
            mockAccountId
        )
        dto = WithdrawFromAccountDto.create({
            accountId: mockAccountId,
            withdrawAmount: 100,
        })
    })

    it('should withdraw the correct amount to the correct account', async () => {
        const dto = WithdrawFromAccountDto.create({
            accountId: mockAccountId,
            withdrawAmount: 100,
        })
        ;(mockAccountRepository.getById as Mock).mockResolvedValue(mockAccount)
        ;(mockTransactionRepository.save as Mock).mockResolvedValue(
            mockTransaction
        )

        const results = await service.use(dto)

        expect(results).toMatchObject({
            id: mockTransactionId,
            amount: 100,
            type: 'expense',
            accountId: mockAccountId,
        })
        expect(results).toBeInstanceOf(WithdrawFromAccountResponseDto)
        expect(mockAccount.balance.value).toBe(100)
        expect(mockAccountRepository.getById).toHaveBeenCalledOnce()
        expect(mockAccountRepository.save).toHaveBeenCalledOnce()
        expect(mockTransactionRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                id: undefined,
                type: expect.objectContaining({ value: 'expense' }),
            })
        )
    })

    it('should throw AccountNotFoundError', async () => {
        ;(mockAccountRepository.getById as Mock).mockResolvedValue()

        await expect(service.use(dto)).rejects.toThrow(AccountNotFoundError)
    })
    it('should throw a ServiceError wrapping the DatabaseError from the repository', async () => {
        const error = new DatabaseError('Something went wrong')
        ;(mockAccountRepository.getById as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(ServiceError)
        await expect(service.use(dto)).rejects.toMatchObject({
            cause: expect.any(DatabaseError),
        })
    })
    it('should throw a ServiceError wrapping the DomainError', async () => {
        dto = WithdrawFromAccountDto.create({
            accountId: mockAccountId,
            withdrawAmount: 300,
        })
        ;(mockAccountRepository.getById as Mock).mockResolvedValue(mockAccount)

        await expect(service.use(dto)).rejects.toThrow(ServiceError)
        await expect(service.use(dto)).rejects.toMatchObject({
            cause: expect.any(DomainError),
        })
    })
    it('should throw an UnknownServiceError wrapping other unexpected errors from the repository', async () => {
        const error = new Error('Something went wrong')
        ;(mockAccountRepository.getById as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(UnknownServiceError)
    })
})
