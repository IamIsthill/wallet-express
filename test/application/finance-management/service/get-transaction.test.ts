import { describe, vi, it, expect, beforeEach, Mock } from 'vitest'
import {
    GetTransactionService,
    GetTransactionDto,
    GetTransactionResponseDto,
} from '../../../../src/application/finance-management'
import { mockTransactionRepository } from './setup'
import {
    Amount,
    Transaction,
    TransactionType,
} from '../../../../src/domain/finance-management'
import { AccountNotFoundError } from '../../../../src/application/shared/errors'
import {
    DatabaseError,
    DomainError,
    ServiceError,
    UnknownServiceError,
} from '../../../../src/utils/errors'

describe('GetTransactionService', () => {
    let service: GetTransactionService

    beforeEach(() => {
        vi.clearAllMocks()
        service = new GetTransactionService(mockTransactionRepository)
    })

    it('should fetch transactions under an account id', async () => {
        const dto = new GetTransactionDto({
            accountId: 'acct-id',
            transactionId: 'tx-id',
        })
        const mocks = {
            id: 'tx-id',
            accountId: 'acct-id',
            type: TransactionType.income(),
            amount: Amount.create(100),
        }
        const mockTransaction = new Transaction(
            mocks.id,
            mocks.type,
            mocks.amount,
            mocks.accountId
        )
        ;(mockTransactionRepository.getById as Mock).mockResolvedValue(
            mockTransaction
        )

        const result = await service.use(dto)

        expect(mockTransactionRepository.getById).toBeCalledWith('tx-id')
        expect(result).toBeInstanceOf(GetTransactionResponseDto)
        expect(result).toStrictEqual(
            expect.objectContaining({
                accountId: mocks.accountId,
                id: mocks.id,
                amount: mocks.amount.value,
                type: mocks.type.value,
                targetAccountId: undefined,
            })
        )
    })

    it('should throw NotFound if the transaction was not under the account id', async () => {
        const dto = new GetTransactionDto({
            accountId: 'wrong-id',
            transactionId: 'tx-id',
        })
        const mocks = {
            id: 'tx-id',
            accountId: 'acct-id',
            type: TransactionType.income(),
            amount: Amount.create(100),
        }
        const mockTransaction = new Transaction(
            mocks.id,
            mocks.type,
            mocks.amount,
            mocks.accountId
        )
        ;(mockTransactionRepository.getById as Mock).mockResolvedValue(
            mockTransaction
        )

        await expect(service.use(dto)).rejects.toThrow(AccountNotFoundError)
        expect(mockTransactionRepository.getById).toBeCalledWith('tx-id')
    })

    it('should throw a ServiceError wrapping the DatabaseError from the repository', async () => {
        const dto = new GetTransactionDto({
            accountId: 'wrong-id',
            transactionId: 'tx-id',
        })
        const error = new DatabaseError('Something went wrong')
        ;(mockTransactionRepository.getById as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(ServiceError)
        await expect(service.use(dto)).rejects.toHaveProperty('cause', error)
    })

    it('should throw a ServiceError wrapping the DomainError from the repository', async () => {
        const dto = new GetTransactionDto({
            accountId: 'wrong-id',
            transactionId: 'tx-id',
        })
        const error = new DomainError('Something went wrong')
        ;(mockTransactionRepository.getById as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(ServiceError)
        await expect(service.use(dto)).rejects.toHaveProperty('cause', error)
    })

    it('should throw an UnknownServiceError wrapping other unexpected errors from the repository', async () => {
        const dto = new GetTransactionDto({
            accountId: 'wrong-id',
            transactionId: 'tx-id',
        })
        const error = new Error('Something went wrong')
        ;(mockTransactionRepository.getById as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(UnknownServiceError)
        await expect(service.use(dto)).rejects.toHaveProperty('cause', error)
    })
})
