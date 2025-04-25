import { z } from 'zod'
import { validate } from '../../../utils/lib'
import { BaseTransactionDto } from '../dto'
import { Transaction } from '../../../domain/finance-management'

export class GetAccountTransactionsDto {
    private schema = z.object({
        accountId: z.string().min(1, 'Account id to deposit to must be set'),
    })
    public readonly accountId: string

    constructor(request: { accountId: string }) {
        const data = validate(this.schema, request)
        this.accountId = data.accountId
    }
}

export class GetAccountTransactionsResponseDto {
    public readonly transactions: BaseTransactionDto[]

    constructor(transactions: Transaction[]) {
        const transactionDtos = transactions.map(
            (tx) => new BaseTransactionDto(tx)
        )
        this.transactions = transactionDtos
    }
}
