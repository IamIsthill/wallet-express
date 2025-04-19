import { TransactionType, Amount } from "../value-object"
import { MissingTargetAccountError, TargetAccountNotAllowedError } from "../../shared/errors"

export class Transaction {
    public readonly id: string | undefined
    public type: TransactionType
    public amount: Amount
    public accountId: string
    public targetAccountId?: string

    constructor(
        id: string | undefined,
        type: TransactionType,
        amount: Amount,
        accountId: string,
        targetAccountId?: string
    ) {
        if (type.equals(TransactionType.transfer()) && !targetAccountId) {
            throw new MissingTargetAccountError();
        }
        if (type.value !== 'transfer' && targetAccountId) {
            throw new TargetAccountNotAllowedError()
        }

        this.id = id;
        this.type = type;
        this.amount = amount;
        this.accountId = accountId;
        this.targetAccountId = targetAccountId;
    }

    public equals(other: Transaction): boolean {
        return (
            this.id === other.id &&
            this.accountId === other.accountId &&
            this.amount.equals(other.amount) &&
            this.type.value === other.type.value &&
            this.targetAccountId === other.targetAccountId
        );
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
        };
    }
}
