import { z } from 'zod'
import { validate } from '../../../utils/lib'
import { Account } from '../../../domain/finance-management'

export class GetAccountDto {
    public readonly accountId: string
    private schema = z.object({
        accountId: z
            .string()
            .min(1, 'AccountId is required and must be a string'),
    })

    constructor(accountId: string) {
        const data = validate(this.schema, { accountId })
        this.accountId = data.accountId
    }
}

export class GetAccountResponseDto {
    public readonly id: string
    public readonly name: string
    public readonly balance: number
    public readonly transactions: string[]

    constructor(account: Account) {
        this.transactions = account.getTransactionIds()
        this.id = account.id!
        this.name = account.name
        this.balance = account.balance.value
    }
}
