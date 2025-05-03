import { TransactionType, Amount } from '../value-object'
import {
    DifferentTargetAccountIdError,
    MissingTargetAccountError,
    TargetAccountNotAllowedError,
    TargetAccountNotDefinedError,
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
        if (type.isTransfer() && !targetAccountId) {
            throw new MissingTargetAccountError()
        }

        if (!type.isTransfer() && targetAccountId) {
            throw new TargetAccountNotAllowedError()
        }

        return new Transaction(id, type, amount, accountId, targetAccountId)
    }

    public changeType(updateType: TransactionType, targetAccountId?: string) {
        if (updateType.isTransfer() && targetAccountId == undefined) {
            throw new TargetAccountNotDefinedError()
        }

        if (!updateType.isTransfer() && targetAccountId !== undefined) {
            throw new TargetAccountNotAllowedError()
        }

        if (updateType.isTransfer() && this.type.isTransfer() && this.targetAccountId != targetAccountId) {
                throw new DifferentTargetAccountIdError()
            }
        this.targetAccountId = targetAccountId
        this.type = updateType
    }
}
