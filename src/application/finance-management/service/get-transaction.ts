import {
    Transaction,
    TransactionRepository,
} from '../../../domain/finance-management'
import {
    DatabaseError,
    ServiceError,
    UnknownServiceError,
} from '../../../utils/errors'
import { AccountNotFoundError } from '../../shared/errors'
import { validate } from '../../../utils/lib'
import { z } from 'zod'

export class GetTransactionDto {
    private schema = z.object({
        accountId: z.string().min(1, 'Account id is required'),
        transactionId: z.string().min(1, 'Transaction id is required'),
    })
    public readonly transactionId: string
    public readonly accountId: string

    constructor(request: { transactionId: string; accountId: string }) {
        const data = validate(this.schema, request)
        this.transactionId = data.transactionId
        this.accountId = data.accountId
    }
}

export class GetTransactionResponseDto {
    public readonly id: string
    public readonly accountId: string
    public readonly amount: number
    public readonly type: string
    public readonly targetAccountId?: string

    constructor(transaction: Transaction) {
        this.id = transaction.id!
        this.accountId = transaction.accountId
        this.amount = transaction.amount.value
        this.type = transaction.type.value
        this.targetAccountId = transaction.targetAccountId
    }
}

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
