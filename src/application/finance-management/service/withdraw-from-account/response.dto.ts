import {
    Transaction,
    TransactionTypeEnum,
} from '../../../../domain/finance-management'

export class WithdrawFromAccountResponseDto {
    public readonly id: string
    public readonly amount: number
    public readonly accountId: string
    public readonly type: TransactionTypeEnum

    private constructor(transaction: Transaction) {
        this.id = transaction.id!
        this.amount = transaction.amount.value
        this.accountId = transaction.accountId
        this.type = transaction.type.value
    }

    static create(transaction: Transaction) {
        return new WithdrawFromAccountResponseDto(transaction)
    }
}
