import { z } from 'zod'
import {
    Account,
    Balance,
    Transaction,
} from '../../../../domain/finance-management'
import { validate } from '../../../../utils/lib'

export class CreateAccountDto {
    private schema = z.object({
        name: z.string().min(1, 'Account name is required'),
        balance: z.number().min(0, 'Initial balance cannot be negative'),
    })
    public readonly name: string
    public readonly balance: Balance

    constructor(request: { name: string; balance: number }) {
        const data = validate(this.schema, request)
        this.name = data.name
        this.balance = Balance.create(data.balance)
    }
}

export class CreateAccountResponseDto {
    public readonly id: string
    public readonly name: string
    public readonly balance: number
    public readonly transactions: Transaction[]

    constructor(account: Account) {
        this.id = account.id!
        this.name = account.name
        this.balance = account.balance.value
        this.transactions = account.getTransactions()
    }
}
