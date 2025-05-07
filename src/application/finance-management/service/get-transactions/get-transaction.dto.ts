import { validate } from '../../../../utils/lib'
import { z } from 'zod'
import { Transaction } from '../../../../domain/finance-management'

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
