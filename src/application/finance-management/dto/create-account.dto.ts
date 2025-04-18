import {z} from 'zod'
import { ServiceError } from '../../shared/errors'
import { Transaction } from '../../../domain/finance-management'
import { Account } from '../../../domain/finance-management'

export class CreateAccountDto {
    static schema = z.object({
        name: z.string().min(1, 'Account name is required'),
        balance: z.number().min(0, 'Initial balance cannot be negative'),
    })

    constructor(public readonly name: string, public readonly balance: number) {
        const data = CreateAccountDto.validate(name, balance)
        this.name = name
        this.balance = balance
    }

    private static validate(name: string, balance: number) {
        const {data, success, error} = CreateAccountDto.schema.safeParse({name, balance})

        if(!success) {
            throw new ServiceError(`Invalid paramaters: ${error.issues.map(issue => issue.message).join(', ')}`)
        }
        return data
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