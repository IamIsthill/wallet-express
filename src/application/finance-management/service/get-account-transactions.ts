import { AccountRepository } from '../../../domain/finance-management'
import { AccountNotFoundError } from '../../shared/errors'
import {
    ServiceError,
    UnknownServiceError,
    DatabaseError,
} from '../../../utils/errors'
import {
    GetAccountTransactionsDto,
    GetAccountTransactionsResponseDto,
} from '../dto'

export class GetAccountTransactions {
    constructor(private readonly accountRepo: AccountRepository) {}

    async use(dto: GetAccountTransactionsDto) {
        try {
            const account = await this.accountRepo.getById(dto.accountId, {
                hydrate: true,
            })

            if (!account) {
                throw new AccountNotFoundError(dto.accountId)
            }
            const transactions = account.getTransactions()

            return new GetAccountTransactionsResponseDto(transactions)
        } catch (error) {
            if (error instanceof AccountNotFoundError) {
                throw error
            } else if (error instanceof DatabaseError) {
                throw new ServiceError(error.message, { cause: error })
            } else {
                throw new UnknownServiceError(error)
            }
        }
    }
}
