import { TransactionType, Amount } from '../value-object'
import {
    MissingTargetAccountError,
    TargetAccountNotAllowedError,
} from '../../shared/errors'
import { Account } from '../aggregates'

export class Transaction {
    public readonly id: string | undefined
    public type: TransactionType
    public amount: Amount
    public accountId: string
    public targetAccountId?: string
    public account?: Account
    public targetAccount?: Account

    constructor(
        id: string | undefined,
        type: TransactionType,
        amount: Amount,
        accountId: string,
        targetAccountId?: string
    ) {
        if (
            (type.equals(TransactionType.inward_transfer()) ||
                type.equals(TransactionType.outward_transfer())) &&
            !targetAccountId
        ) {
            throw new MissingTargetAccountError()
        }
        if (
            !(
                type.equals(TransactionType.inward_transfer()) ||
                type.equals(TransactionType.outward_transfer())
            ) &&
            targetAccountId
        ) {
            throw new TargetAccountNotAllowedError()
        }

        this.id = id
        this.type = type
        this.amount = amount
        this.accountId = accountId
        this.targetAccountId = targetAccountId
    }
    public setAccount(account: Account) {
        this.account = account
    }
    public setTargetAccount(account: Account | undefined) {
        this.targetAccount = account
    }

    public equals(other: Transaction): boolean {
        return (
            this.id === other.id &&
            this.accountId === other.accountId &&
            this.amount.equals(other.amount) &&
            this.type.value === other.type.value &&
            this.targetAccountId === other.targetAccountId
        )
    }

    public hasSameType(other: Transaction) {
        return this.type.value == other.type.value
    }

    public toDTO() {
        return {
            id: this.id,
            type: this.type.value,
            amount: this.amount.value,
            accountId: this.accountId,
            targetAccountId: this.targetAccountId,
        }
    }
    public static create(
        id: string | undefined,
        type: TransactionType,
        amount: Amount,
        accountId: string,
        targetAccountId?: string
    ) {
        const isTransfer =
            type.equals(TransactionType.inward_transfer()) ||
            type.equals(TransactionType.outward_transfer())

        if (isTransfer && !targetAccountId) {
            throw new MissingTargetAccountError()
        }

        if (!isTransfer && targetAccountId) {
            throw new TargetAccountNotAllowedError()
        }

        return new Transaction(id, type, amount, accountId, targetAccountId)
    }
}
