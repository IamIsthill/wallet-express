import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import {
    CreateAccountDto,
    CreateAccountService,
    CreateAccountResponseDto,
} from '../../../../src/application/finance-management'
import { Account, Balance } from '../../../../src/domain/finance-management'
import {
    DomainError,
    ServiceError,
    DatabaseError,
} from '../../../../src/utils/errors'
import { mockAccountRepository, mockUnitWork } from './setup'

describe('CreateAccountService', () => {
    let createAccountService: CreateAccountService

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks()
        createAccountService = new CreateAccountService(mockUnitWork)
    })

    it('should create an Account entity and return a CreateAccountResponseDto on success', async () => {
        const balance = Balance.create(100)
        const createAccountDto = new CreateAccountDto({
            name: 'Savings Account',
            balance: 100,
        })
        const mockAccount = new Account(
            'account-id',
            'Savings Account',
            balance
        )
        ;(mockAccountRepository.save as Mock).mockResolvedValue(mockAccount)

        const result = await createAccountService.use(createAccountDto)

        expect(mockAccountRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Savings Account',
                balance: balance,
                id: undefined,
            })
        )
        expect(result).toBeInstanceOf(CreateAccountResponseDto)
        expect(result.id).toBe('account-id')
        expect(result.name).toBe('Savings Account')
        expect(result.balance).toBe(100)
        expect(result.transactions).toEqual([])
    })

    it('should throw a ServiceError with the DatabaseError cause if the repository throws a DatabaseError', async () => {
        const createAccountDto = new CreateAccountDto({
            name: 'Savings Account',
            balance: 100,
        })
        const databaseError = new DatabaseError('Database connection failed')
        ;(mockAccountRepository.save as Mock).mockRejectedValue(databaseError)

        await expect(
            createAccountService.use(createAccountDto)
        ).rejects.toThrow(ServiceError)
        await expect(
            createAccountService.use(createAccountDto)
        ).rejects.toHaveProperty('cause', databaseError)
    })

    it('should throw a ServiceError with the DomainError cause if the repository throws a DomainError', async () => {
        const createAccountDto = new CreateAccountDto({
            name: 'Savings Account',
            balance: 100,
        })
        const domainError = new DomainError('Invalid account state')
        ;(mockAccountRepository.save as Mock).mockRejectedValue(domainError)

        await expect(
            createAccountService.use(createAccountDto)
        ).rejects.toThrow(ServiceError)
        await expect(
            createAccountService.use(createAccountDto)
        ).rejects.toHaveProperty('cause', domainError)
    })

    it('should throw a generic ServiceError for other unexpected errors', async () => {
        const createAccountDto = new CreateAccountDto({
            name: 'Savings Account',
            balance: 100,
        })
        const unexpectedError = new Error('Something unexpected happened')
        ;(mockAccountRepository.save as Mock).mockRejectedValue(unexpectedError)

        await expect(
            createAccountService.use(createAccountDto)
        ).rejects.toThrow(ServiceError)
        await expect(
            createAccountService.use(createAccountDto)
        ).rejects.toHaveProperty('cause', unexpectedError)
    })
})
