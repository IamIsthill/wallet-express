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
            const account = await this.accountRepo.getAccountByAccountId(
                dto.accountId
            )

            if (!account) {
                throw new AccountNotFoundError(dto.accountId)
            }

            const depositTransaction = account.deposit(dto.depositAmount)
            const savedTransaction =
                await this.transactionRepo.createTransaction(depositTransaction)

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
