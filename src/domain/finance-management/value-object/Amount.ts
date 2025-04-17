export class Amount {
    private constructor(public readonly value: number) {
        if(value <= 0) {
            throw new Error('Amount must be greater than zero')
        }
    }

    static create(value: number): Amount {
        return new Amount(value)
    }

    public equals(other: Amount) {
        return other.value == this.value
    }
}