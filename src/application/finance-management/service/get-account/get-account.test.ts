import { describe, vi, it, expect, beforeEach, Mock } from 'vitest'
import { GetAccountDto, GetAccountResponseDto } from './get-account.dto'
import { GetAccountService } from './get-account.service'
import { Account, Balance } from '../../../../domain/finance-management'
import { mockAccountRepository } from '../../../../../test/mocks'
import {
    DomainError,
    ServiceError,
    UnknownServiceError,
    DatabaseError,
} from '../../../../utils/errors'
import { AccountNotFoundError } from '../../../shared/errors'

describe('GetAccountService', () => {
    let getAccountService: GetAccountService

    beforeEach(() => {
        vi.clearAllMocks()
        getAccountService = new GetAccountService(mockAccountRepository)
    })

    it('should find an existing account and return a dto on success', async () => {
        const getAccountDto = new GetAccountDto('account-id')
        const mockAccount = new Account(
            'account-id',
            'Savings Account',
            Balance.create(100)
        )
        ;(mockAccountRepository.getById as Mock).mockResolvedValue(mockAccount)

        const response = await getAccountService.use(getAccountDto)

        expect(mockAccountRepository.getById).toHaveBeenCalledWith(
            'account-id',
            { hydrate: false }
        )
        expect(response).toBeInstanceOf(GetAccountResponseDto)
        expect(response.id).toBe('account-id')
        expect(response.name).toBe('Savings Account')
        expect(response.balance).toBe(100)
        expect(response.transactions).toHaveLength(0)
    })

    it('should throw an AccountNotFoundError when no account is found', async () => {
        const getAccountDto = new GetAccountDto('not-existing-id')
        const mockReturn = undefined
        ;(mockAccountRepository.getById as Mock).mockResolvedValue(mockReturn)

        await expect(getAccountService.use(getAccountDto)).rejects.toThrow(
            AccountNotFoundError
        )
    })

    it('should throw a ServiceError wrapping the DatabaseError from the repository', async () => {
        const getAccountDto = new GetAccountDto('account-id')
        const databaseError = new DatabaseError('Something went wrong')

        ;(mockAccountRepository.getById as Mock).mockRejectedValue(
            databaseError
        )

        await expect(getAccountService.use(getAccountDto)).rejects.toThrow(
            ServiceError
        )
        await expect(
            getAccountService.use(getAccountDto)
        ).rejects.toHaveProperty('cause', databaseError)
    })

    it('should throw a ServiceError wrapping the DomainError from the repository', async () => {
        const getAccountDto = new GetAccountDto('account-id')
        const domainError = new DomainError('Something went wrong')

        ;(mockAccountRepository.getById as Mock).mockRejectedValue(domainError)

        await expect(getAccountService.use(getAccountDto)).rejects.toThrow(
            ServiceError
        )
        await expect(
            getAccountService.use(getAccountDto)
        ).rejects.toHaveProperty('cause', domainError)
    })

    it('should throw an UnknownServiceError wrapping other unexpected errors from the repository', async () => {
        const getAccountDto = new GetAccountDto('account-id')
        const unknownError = new Error('Something went wrong')

        ;(mockAccountRepository.getById as Mock).mockRejectedValue(unknownError)

        await expect(getAccountService.use(getAccountDto)).rejects.toThrow(
            UnknownServiceError
        )
        await expect(
            getAccountService.use(getAccountDto)
        ).rejects.toHaveProperty('cause', unknownError)
    })
})
