import {
    UpdateAccountService,
    UpdateAccountDto,
    UpdateAccountResponseDto,
} from '../../../../src/application/finance-management'
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { Account, Balance } from '../../../../src/domain/finance-management'
import {
    DomainError,
    ServiceError,
    DatabaseError,
    UnknownServiceError,
} from '../../../../src/utils/errors'
import { mockAccountRepository } from './setup'
import { AccountNotFoundError } from '../../../../src/application/shared/errors'

describe('UpdateAccountService', () => {
    let service: UpdateAccountService

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks()
        service = new UpdateAccountService(mockAccountRepository)
    })

    it('should find the correct Account Entity, update it and return dto as response', async () => {
        const dto = new UpdateAccountDto({
            accountId: 'account-id',
            name: 'new name',
        })
        const mockAccount = new Account(
            'account-id',
            'old name',
            Balance.create(100)
        )
        ;(
            mockAccountRepository.getAccountByAccountId as Mock
        ).mockResolvedValue(mockAccount)

        const result = await service.use(dto)

        expect(
            mockAccountRepository.getAccountByAccountId
        ).toHaveBeenCalledWith('account-id')
        expect(mockAccountRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'new name',
                balance: Balance.create(100),
                id: 'account-id',
            })
        )
        expect(result).toBeInstanceOf(UpdateAccountResponseDto)
        expect(result).toStrictEqual(
            expect.objectContaining({
                accountId: 'account-id',
                name: 'new name',
            })
        )
    })

    it('should accept accountId only for the dto and response is the same', async () => {
        const dto = new UpdateAccountDto({ accountId: 'account-id' })
        const mockAccount = new Account(
            'account-id',
            'old name',
            Balance.create(100)
        )
        ;(
            mockAccountRepository.getAccountByAccountId as Mock
        ).mockResolvedValue(mockAccount)

        const result = await service.use(dto)

        expect(
            mockAccountRepository.getAccountByAccountId
        ).toHaveBeenCalledWith('account-id')
        expect(mockAccountRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'old name',
                balance: Balance.create(100),
                id: 'account-id',
            })
        )
        expect(result).toBeInstanceOf(UpdateAccountResponseDto)
        expect(result).toStrictEqual(
            expect.objectContaining({
                accountId: 'account-id',
            })
        )
    })

    it('should throw AccountNotFoundError if accountId was not found', async () => {
        const dto = new UpdateAccountDto({ accountId: 'not-existing-id' })
        const error = undefined
        ;(
            mockAccountRepository.getAccountByAccountId as Mock
        ).mockResolvedValue(error)

        await expect(service.use(dto)).rejects.toThrow(AccountNotFoundError)
        expect(
            mockAccountRepository.getAccountByAccountId
        ).toHaveBeenCalledWith('not-existing-id')
    })

    it('should throw a ServiceError with the DatabaseError cause if the repository throws a DatabaseError', async () => {
        const dto = new UpdateAccountDto({ accountId: 'account-id' })
        const error = new DatabaseError('Something went wrong')
        const mockAccount = new Account(
            'account-id',
            'old name',
            Balance.create(100)
        )
        ;(
            mockAccountRepository.getAccountByAccountId as Mock
        ).mockResolvedValue(mockAccount)
        ;(mockAccountRepository.save as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(ServiceError)
        await expect(service.use(dto)).rejects.toHaveProperty('cause', error)
    })

    it('should throw a ServiceError with the DomainError cause if the repository throws a DomainError', async () => {
        const dto = new UpdateAccountDto({ accountId: 'account-id' })
        const error = new DomainError('Something went wrong')
        const mockAccount = new Account(
            'account-id',
            'old name',
            Balance.create(100)
        )
        ;(
            mockAccountRepository.getAccountByAccountId as Mock
        ).mockResolvedValue(mockAccount)
        ;(mockAccountRepository.save as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(ServiceError)
        await expect(service.use(dto)).rejects.toHaveProperty('cause', error)
    })

    it('should throw a UnknownServiceError for other unexpected errors', async () => {
        const dto = new UpdateAccountDto({ accountId: 'account-id' })
        const error = new Error('Something went wrong')
        const mockAccount = new Account(
            'account-id',
            'old name',
            Balance.create(100)
        )
        ;(
            mockAccountRepository.getAccountByAccountId as Mock
        ).mockResolvedValue(mockAccount)
        ;(mockAccountRepository.save as Mock).mockRejectedValue(error)

        await expect(service.use(dto)).rejects.toThrow(UnknownServiceError)
        await expect(service.use(dto)).rejects.toHaveProperty('cause', error)
    })
})
