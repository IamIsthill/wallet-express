export class Amount {
    private constructor(private readonly _value: number) {
        if(_value <= 0) {
            throw new Error('Amount must be greater than zero')
        }
    }

    get value() {
        return this._value
    }

    static create(value: number): Amount {
        return new Amount(value)
    }

    public equals(other: Amount) {
        return other.value == this.value
    }
}