import { TransactionRepository } from '../../../../domain/finance-management'
import {
    DatabaseError,
    ServiceError,
    UnknownServiceError,
} from '../../../../utils/errors'
import { AccountNotFoundError } from '../../../shared/errors'
import {
    GetTransactionDto,
    GetTransactionResponseDto,
} from './get-transaction.dto'

export class GetTransactionService {
    constructor(private readonly transctionRepo: TransactionRepository) {}

    async use(dto: GetTransactionDto) {
        try {
            const transaction = await this.transctionRepo.getById(
                dto.transactionId
            )

            if (!transaction || transaction.accountId != dto.accountId) {
                throw new AccountNotFoundError(dto.transactionId)
            }

            const response = new GetTransactionResponseDto(transaction)
            return response
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
