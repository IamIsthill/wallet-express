export class TransactionType {
    public readonly value: TransactionTypeEnum

    private constructor(value: TransactionTypeEnum) {
        this.value = value
    }

    public static income(): TransactionType {
        return new TransactionType('income')
    }
    public static expense(): TransactionType {
        return new TransactionType('expense')
    }

    public static inward_transfer(): TransactionType {
        return new TransactionType('inward_transfer')
    }

    public static outward_transfer(): TransactionType {
        return new TransactionType('outward_transfer')
    }

    static _create(value: TransactionTypeEnum) {
        return new TransactionType(value)
    }

    public isTransfer() {
        return (
            this.value == 'inward_transfer' || this.value == 'outward_transfer'
        )
    }

    equals(other: TransactionType) {
        return other.value == this.value
    }
}

export type TransactionTypeEnum =
    | 'income'
    | 'expense'
    | 'inward_transfer'
    | 'outward_transfer'
