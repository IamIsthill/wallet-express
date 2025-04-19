import { describe, vi, it, expect, beforeEach, Mock } from "vitest";
import { GetAccountService, GetAccountDto, GetAccountResponseDto } from "../../../../src/application/finance-management";
import { Account, Balance } from "../../../../src/domain/finance-management";
import { mockAccountRepository } from "./setup";
import { DomainError, ServiceError, UnknownServiceError, DatabaseError } from "../../../../src/utils/errors";
import { AccountNotFoundError } from "../../../../src/application/shared/errors";

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
        );
        (mockAccountRepository.getAccountByAccountId as Mock).mockResolvedValue(mockAccount)

        const res = await getAccountService.use(getAccountDto)

        expect(mockAccountRepository.getAccountByAccountId).toHaveBeenCalledWith('account-id')
        expect(res).toBeInstanceOf(GetAccountResponseDto)
        expect(res.id).toBe('account-id')
        expect(res.name).toBe('Savings Account')
        expect(res.balance).toBe(100)
        expect(res.transactions).toHaveLength(0)
    })

    it('should throw an AccountNotFoundError when no account is found', async () => {
        const getAccountDto = new GetAccountDto('not-existing-id');

        (mockAccountRepository.getAccountByAccountId as Mock).mockResolvedValue(undefined);

        await expect(getAccountService.use(getAccountDto)).rejects.toThrow(AccountNotFoundError)
    })

    it('should throw a ServiceError wrapping the DatabaseError from the repository', async () => {
        const getAccountDto = new GetAccountDto('account-id')
        const databaseError = new DatabaseError('Something went wrong');

        (mockAccountRepository.getAccountByAccountId as Mock).mockRejectedValue(databaseError);

        await expect(getAccountService.use(getAccountDto)).rejects.toThrow(ServiceError)
        await expect(getAccountService.use(getAccountDto)).rejects.toHaveProperty('cause', databaseError)
    })
    
    it('should throw a ServiceError wrapping the DomainError from the repository', async () => {
        const getAccountDto = new GetAccountDto('account-id')
        const domainError = new DomainError('Something went wrong');

        (mockAccountRepository.getAccountByAccountId as Mock).mockRejectedValue(domainError);

        await expect(getAccountService.use(getAccountDto)).rejects.toThrow(ServiceError)
        await expect(getAccountService.use(getAccountDto)).rejects.toHaveProperty('cause', domainError)
    })

    it('should throw an UnknownServiceError wrapping other unexpected errors from the repository', async () => {
        const getAccountDto = new GetAccountDto('account-id')
        const unknownError = new Error('Something went wrong');

        (mockAccountRepository.getAccountByAccountId as Mock).mockRejectedValue(unknownError);

        await expect(getAccountService.use(getAccountDto)).rejects.toThrow(UnknownServiceError)
        await expect(getAccountService.use(getAccountDto)).rejects.toHaveProperty('cause', unknownError)
    })
})