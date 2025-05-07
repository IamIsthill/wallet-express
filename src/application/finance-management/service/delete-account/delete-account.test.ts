import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { mockAccountRepository } from '../../../../../test/mocks'
import { DeleteAccountDto } from './delete-account.dto'
import { DeleteAccountService } from './delete-account.service'
import { Account, Balance } from '../../../../domain/finance-management'
import { AccountNotFoundError } from '../../../shared/errors'
import {
    DatabaseError,
    UnknownServiceError,
    ServiceError,
    DomainError,
} from '../../../../utils/errors'

describe('DeleteAccount', () => {
    let service: DeleteAccountService

    beforeEach(() => {
        vi.clearAllMocks()
        service = new DeleteAccountService(mockAccountRepository)
    })

    it('should delete the account', async () => {
        const dto = new DeleteAccountDto({ accountId: 'account-id' })
        const mockAccount = new Account(
            'account-id',
            'Savings',
            Balance.create(100)
        )
        ;(mockAccountRepository.getById as Mock).mockResolvedValue(mockAccount)

        await service.use(dto)

        expect(mockAccountRepository.getById).toBeCalledWith('account-id')
        expect(mockAccountRepository.delete).toBeCalledTimes(1)
    })

    it('should throw an AccountNotFoundError when no account to deposit to is found', async () => {
        const dto = new DeleteAccountDto({ accountId: 'account-id' })
        const mockAccount = undefined
        ;(mockAccountRepository.getById as Mock).mockResolvedValue(mockAccount)

        await expect(service.use(dto)).rejects.toThrow(AccountNotFoundError)
    })

    it('should throw a ServiceError wrapping the DatabaseError from the repository', async () => {
        const dto = new DeleteAccountDto({
            accountId: 'non-existent-id',
        })
        const error = new DatabaseError('Something went wrong')
        ;(mockAccountRepository.getById as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(ServiceError)
        await expect(service.use(dto)).rejects.toHaveProperty('cause', error)
    })

    it('should throw a ServiceError wrapping the DomainError from the repository', async () => {
        const dto = new DeleteAccountDto({
            accountId: 'non-existent-id',
        })
        const error = new DomainError('Something went wrong')
        ;(mockAccountRepository.getById as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(ServiceError)
        await expect(service.use(dto)).rejects.toHaveProperty('cause', error)
    })

    it('should throw an UnknownServiceError wrapping other unexpected errors from the repository', async () => {
        const dto = new DeleteAccountDto({
            accountId: 'non-existent-id',
        })
        const error = new Error('Something went wrong')
        ;(mockAccountRepository.getById as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(UnknownServiceError)
        await expect(service.use(dto)).rejects.toHaveProperty('cause', error)
    })
})
