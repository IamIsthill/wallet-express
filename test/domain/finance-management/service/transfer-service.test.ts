import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import {
    TransferService,
    Account,
    Balance,
    Transaction,
    TransactionType,
    Amount,
} from '../../../../src/domain/finance-management'
import {
    mockAccountRepository,
    mockTransactionRepository,
} from '../../../application/finance-management/service/setup'
import { InvalidTransferTargetError } from '../../../../src/domain/shared/errors'
import { AccountNotFoundError } from '../../../../src/application/shared/errors'

describe('TransferService', () => {
    let service: TransferService
    let mockSource: Account
    let mockTarget: Account
    let mockOutward: Transaction

    beforeEach(() => {
        vi.clearAllMocks()
        mockSource = new Account('acc-1', 'Savings', Balance.create(100))
        mockTarget = new Account('acc-2', 'Savings', Balance.create(100))
        mockOutward = Transaction.create(
            'tx-1',
            TransactionType.outward_transfer(),
            Amount.create(20),
            'acc-1',
            'acc-2'
        )
        service = new TransferService(
            mockAccountRepository,
            mockTransactionRepository
        )
    })

    it('should persist two transaction', async () => {
        ;(mockAccountRepository.getById as Mock).mockImplementation(
            async (id: string) => {
                if (id == 'acc-1') return mockSource
                if (id == 'acc-2') return mockTarget
                return
            }
        )
        ;(mockTransactionRepository.save as Mock).mockImplementation(
            async (transaction: Transaction) => {
                if (transaction.accountId == 'acc-1') return mockOutward
                return
            }
        )

        const results = await service.transfer({
            sourceAccountId: 'acc-1',
            targetAccountId: 'acc-2',
            amount: 20,
        })

        expect(mockSource.balance.value + 20).toBe(
            mockTarget.balance.value - 20
        )
        expect(mockAccountRepository.getById).toHaveBeenCalledTimes(2)
        expect(mockAccountRepository.save).toHaveBeenCalledTimes(2)
        expect(mockTransactionRepository.save).toHaveBeenCalledTimes(2)
        expect(mockTransactionRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                accountId: 'acc-1',
                type: expect.objectContaining({ value: 'outward_transfer' }),
            })
        )
        expect(mockTransactionRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                accountId: 'acc-2',
                type: expect.objectContaining({ value: 'inward_transfer' }),
            })
        )
        expect(results).toMatchObject({
            id: 'tx-1',
            amount: expect.objectContaining({ value: 20 }),
            accountId: 'acc-1',
            targetAccountId: 'acc-2',
            type: expect.objectContaining({ value: 'outward_transfer' }),
        })
    })

    it('should throw error if target and source is the same', async () => {
        await expect(() =>
            service.transfer({
                sourceAccountId: '1',
                targetAccountId: '1',
                amount: 200,
            })
        ).rejects.toThrow(InvalidTransferTargetError)
    })

    it('should throw error if accounts are not found', async () => {
        const account = undefined
        ;(mockAccountRepository.getById as Mock).mockResolvedValue(account)

        await expect(() =>
            service.transfer({
                sourceAccountId: 'non-existent1',
                targetAccountId: 'non-existent2',
                amount: 200,
            })
        ).rejects.toThrow(AccountNotFoundError)
    })
})
