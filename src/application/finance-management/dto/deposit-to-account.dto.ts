import { validate } from '../../../utils/lib'
import { z } from 'zod'
import { BaseTransactionDto } from './transaction.dto'
import { Transaction } from '../../../domain/finance-management'

export class DepositToAccountDto {
    private schema = z.object({
        accountId: z.string().min(1, 'Account id to deposit to must be set'),
        depositAmount: z
            .number()
            .min(1, 'Deposit amount must be greater than zero'),
    })
    public readonly accountId: string
    public readonly depositAmount: number

    constructor(accountId: string, depositAmount: number) {
        const data = validate(this.schema, { accountId, depositAmount })
        this.accountId = data.accountId
        this.depositAmount = data.depositAmount
    }
}

export class DepositToTransactionResponseDto extends BaseTransactionDto {
    public readonly id: string
    constructor(transaction: Transaction) {
        super(transaction)
        this.id = transaction.id!
    }
}
