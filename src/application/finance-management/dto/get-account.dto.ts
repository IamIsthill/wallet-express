import { Account } from '../../../domain/finance-management'
import { AccountIdDto } from './id.dto'

export class GetAccountDto extends AccountIdDto {
    constructor(accountId: string) {
        super(
            { accountId: accountId },
            'AccountId is required and must be a string'
        )
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
