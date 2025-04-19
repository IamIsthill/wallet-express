import {z} from 'zod'
import { Transaction } from '../../../domain/finance-management'
import { Account } from '../../../domain/finance-management'
import { validate } from '../../../utils/lib'

export class CreateAccountDto {
    private schema = z.object({
        name: z.string().min(1, 'Account name is required'),
        balance: z.number().min(0, 'Initial balance cannot be negative'),
    })

    constructor(public readonly name: string, public readonly balance: number) {

        const data = validate(this.schema, {name, balance})
        this.name = data.name
        this.balance = data.balance
    }
}



export class CreateAccountResponseDto {
    public readonly id: string
    public readonly name: string
    public readonly balance: number
    public readonly transactions: Transaction[]

    constructor(account: Account) {
        this.id = account.id
        this.name = account.name
        this.balance = account.balance.value
        this.transactions = account.transactions
    }
}