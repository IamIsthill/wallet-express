import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateAccountDto, CreateAccountService, CreateAccountResponseDto } from '../../../../src/application/finance-management';
import { AccountRepository, Account, Balance } from '../../../../src/domain/finance-management';
import { DomainError } from '../../../../src/domain/shared/errors';
import { DatabaseError } from '../../../../src/infrastructure/shared/errors';
import { ServiceError } from '../../../../src/application/shared/errors';

// Mock the AccountRepository
const mockAccountRepository: AccountRepository = {
    createAccount: vi.fn(),
    findTransactionsByAccountId: vi.fn(),
    updateAccount: vi.fn(),
    deleteAccount: vi.fn(),
    deleteTransaction: vi.fn(),
    getAccountByAccountId: vi.fn(),
    getAllAccounts: vi.fn(),
    getTransactionByTransactionId: vi.fn(),
    updateTransaction: vi.fn()
};

describe('CreateAccountService', () => {
    let createAccountService: CreateAccountService;

    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
        createAccountService = new CreateAccountService(mockAccountRepository);
    });

    it('should create an account and return a CreateAccountResponseDto on success', async () => {
        // Arrange
        const createAccountDto = new CreateAccountDto('Savings Account', 100 );
        const mockAccount = new Account(
            'account-id',
            'Savings Account',
            Balance.create(100)
        );
        (mockAccountRepository.createAccount as vi.Mock).mockResolvedValue(mockAccount);

        // Act
        const result = await createAccountService.use(createAccountDto);

        // Assert
        expect(mockAccountRepository.createAccount).toHaveBeenCalledWith('Savings Account', 100);
        expect(result).toBeInstanceOf(CreateAccountResponseDto);
        expect(result.id).toBe('account-id');
        expect(result.name).toBe('Savings Account');
        expect(result.balance).toBe(100);
        expect(result.transactions).toEqual([]);
    });

    it('should throw a ServiceError with the DatabaseError cause if the repository throws a DatabaseError', async () => {
        // Arrange
        const createAccountDto = new CreateAccountDto('Savings Account', 100 );
        const databaseError = new DatabaseError('Database connection failed');
        (mockAccountRepository.createAccount as vi.Mock).mockRejectedValue(databaseError);

        // Act and Assert
        await expect(createAccountService.use(createAccountDto)).rejects.toThrow(ServiceError);
        await expect(createAccountService.use(createAccountDto)).rejects.toHaveProperty('cause', databaseError);
    });

    it('should throw a ServiceError with the DomainError cause if the repository throws a DomainError', async () => {
        // Arrange
        const createAccountDto = new CreateAccountDto('Savings Account', 100 );
        const domainError = new DomainError('Invalid account state');
        (mockAccountRepository.createAccount as vi.Mock).mockRejectedValue(domainError);

        // Act and Assert
        await expect(createAccountService.use(createAccountDto)).rejects.toThrow(ServiceError);
        await expect(createAccountService.use(createAccountDto)).rejects.toHaveProperty('cause', domainError);
    });

    it('should throw a generic ServiceError for other unexpected errors', async () => {
        // Arrange
        const createAccountDto = new CreateAccountDto('Savings Account', 100 );
        const unexpectedError = new Error('Something unexpected happened');
        (mockAccountRepository.createAccount as vi.Mock).mockRejectedValue(unexpectedError);

        // // Act and Assert
        await expect(createAccountService.use(createAccountDto)).rejects.toThrow(ServiceError);
        await expect(createAccountService.use(createAccountDto)).rejects.toHaveProperty('cause', unexpectedError);
    });
});
