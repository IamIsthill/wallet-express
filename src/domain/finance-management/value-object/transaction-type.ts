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
    public static transfer(): TransactionType {
        return new TransactionType('transfer')
    }

    static _create(value: TransactionTypeEnum) {
        return new TransactionType(value)
    }

    equals(other: TransactionType) {
        return other.value == this.value
    }
}

export type TransactionTypeEnum = 'income' | 'expense' | 'transfer'
