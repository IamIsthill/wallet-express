import { Transaction } from "../../../domain/finance-management";

export class BaseTransactionDto {
    public readonly id: string
    public readonly type: string
    public readonly amount: number
    public readonly accountId: string
    public readonly targetAccountId?: string

    constructor(transaction: Transaction) {
        this.id = transaction.id
        this.type = transaction.type.value
        this.amount = transaction.amount.value
        this.accountId = transaction.accountId
        this.targetAccountId = transaction.targetAccountId
    }
}