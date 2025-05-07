import { describe, it, expect, beforeEach, Mock, vi } from 'vitest'
import { mockAccountRepository } from '../../../../../test/application/finance-management/service/setup'
import { GetAccountTransactions } from './get-account-transactions.service'
import {
    GetAccountTransactionsDto,
    GetAccountTransactionsResponseDto,
} from './get-account-transactions.dto'
import {
    Account,
    Amount,
    Transaction,
    TransactionType,
    Balance,
} from '../../../../domain/finance-management'
import { AccountNotFoundError } from '../../../shared/errors'
import {
    DatabaseError,
    DomainError,
    ServiceError,
    UnknownServiceError,
} from '../../../../utils/errors'

describe('GetAccountTransactions', () => {
    let service: GetAccountTransactions

    beforeEach(() => {
        vi.clearAllMocks()
        service = new GetAccountTransactions(mockAccountRepository)
    })

    it('should correctly fetch the transactions of the given id', async () => {
        const dto = new GetAccountTransactionsDto({ accountId: 'account-id' })
        const transactions = [
            new Transaction(
                'tx-1',
                TransactionType.income(),
                Amount.create(100),
                'account-id'
            ),
        ]
        const mockAccount = new Account(
            'account-id',
            'Savings Account',
            Balance.create(100)
        )
        mockAccount.setTransactions(transactions)
        ;(mockAccountRepository.getById as Mock).mockResolvedValue(mockAccount)

        const results = await service.use(dto)

        expect(mockAccountRepository.getById).toBeCalledWith(
            'account-id',
            expect.objectContaining({
                hydrate: true,
            })
        )
        expect(results).toBeInstanceOf(GetAccountTransactionsResponseDto)
        expect(results).toStrictEqual(
            expect.objectContaining({
                transactions: expect.arrayContaining([
                    expect.objectContaining({
                        id: 'tx-1',
                        type: 'income',
                        amount: 100,
                        accountId: 'account-id',
                        targetAccountId: undefined,
                    }),
                ]),
            })
        )
    })

    it('should throw AccountNotFoundError when passed id is not-existent', async () => {
        const dto = new GetAccountTransactionsDto({
            accountId: 'non-existent-id',
        })
        const mockAccount = undefined
        ;(mockAccountRepository.getById as Mock).mockResolvedValue(mockAccount)

        await expect(service.use(dto)).rejects.toThrow(AccountNotFoundError)
    })

    it('should throw a ServiceError wrapping the DatabaseError from the repository', async () => {
        const dto = new GetAccountTransactionsDto({
            accountId: 'non-existent-id',
        })
        const error = new DatabaseError('Something went wrong')
        ;(mockAccountRepository.getById as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(ServiceError)
        await expect(service.use(dto)).rejects.toHaveProperty('cause', error)
    })

    it('should throw a ServiceError wrapping the DomainError from the repository', async () => {
        const dto = new GetAccountTransactionsDto({
            accountId: 'non-existent-id',
        })
        const error = new DomainError('Something went wrong')
        ;(mockAccountRepository.getById as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(ServiceError)
        await expect(service.use(dto)).rejects.toHaveProperty('cause', error)
    })

    it('should throw an UnknownServiceError wrapping other unexpected errors from the repository', async () => {
        const dto = new GetAccountTransactionsDto({
            accountId: 'non-existent-id',
        })
        const error = new Error('Something went wrong')
        ;(mockAccountRepository.getById as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(UnknownServiceError)
        await expect(service.use(dto)).rejects.toHaveProperty('cause', error)
    })
})
