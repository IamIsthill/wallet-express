import {
    AccountRepository,
    TransactionRepository,
} from '../../../domain/finance-management'
import { AccountNotFoundError } from '../../shared/errors'
import {
    DatabaseError,
    ServiceError,
    UnknownServiceError,
} from '../../../utils/errors'
import { DepositToAccountDto, DepositToTransactionResponseDto } from '../dto'

export class DepositToAccountService {
    constructor(
        private readonly transactionRepo: TransactionRepository,
        private readonly accountRepo: AccountRepository
    ) {}

    async use(dto: DepositToAccountDto) {
        try {
            const account = await this.accountRepo.getById(dto.accountId)

            if (!account) {
                throw new AccountNotFoundError(dto.accountId)
            }

            // Create a deposit transaction, return will have an undefined id
            const depositTransaction = account.deposit(dto.depositAmount)
            const savedTransaction =
                await this.transactionRepo.save(depositTransaction) // Persist transaction
            // Add transaction to the account
            account.addTransaction(savedTransaction)
            await this.accountRepo.save(account) // save the updated account, transactions with undefined id will not be saved

            return new DepositToTransactionResponseDto(savedTransaction)
        } catch (error) {
            if (error instanceof AccountNotFoundError) {
                throw error
            } else if (error instanceof DatabaseError) {
                throw new ServiceError(error.message, { cause: error })
            }
            throw new UnknownServiceError(error)
        }
    }
}
