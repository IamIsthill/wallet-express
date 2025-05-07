import {
    AccountRepository,
    TransactionRepository,
    Transaction,
    Account,
} from '../../../../domain/finance-management'
import { AccountNotFoundError } from '../../../shared/errors'
import {
    DomainError,
    ServiceError,
    UnknownServiceError,
} from '../../../../utils/errors'
import { DatabaseError } from 'sequelize'
import { WithdrawFromAccountDto } from './request.dto'
import { WithdrawFromAccountResponseDto } from './response.dto'

export class RepositoryMethods {
    constructor(
        protected readonly accountRepository: AccountRepository,
        protected readonly transactionRepository: TransactionRepository
    ) {}

    protected async getAccount(accountId: string) {
        const account = await this.accountRepository.getById(accountId)
        if (!account) {
            throw new AccountNotFoundError(accountId)
        }
        return account
    }

    protected async saveAccount(account: Account) {
        return this.accountRepository.save(account)
    }

    protected async saveTransaction(transaction: Transaction) {
        return this.transactionRepository.save(transaction)
    }
}

export class WithdrawFromAccountService extends RepositoryMethods {
    constructor(
        protected accountRepository: AccountRepository,
        protected transactionRepository: TransactionRepository
    ) {
        super(accountRepository, transactionRepository)
    }

    async use(dto: WithdrawFromAccountDto) {
        try {
            const account = await this.getAccount(dto.accountId)

            const withdrawTransaction = account.withdraw(dto.withdrawAmount)
            const persistedTransaction =
                await this.saveTransaction(withdrawTransaction)

            // Add transaction to the account then save it
            account.addTransaction(persistedTransaction)
            await this.saveAccount(account)
            return WithdrawFromAccountResponseDto.create(persistedTransaction)
        } catch (error) {
            if (error instanceof AccountNotFoundError) {
                throw error
            } else if (
                error instanceof DomainError ||
                error instanceof DatabaseError
            ) {
                throw new ServiceError(error.message, { cause: error })
            }
            throw new UnknownServiceError(error)
        }
    }
}
