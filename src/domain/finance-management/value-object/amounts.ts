import { InvalidAmountError } from '../../shared/errors'

export class Amount {
    private constructor(private _value: number) {
        if (this._value == 0) {
            throw new InvalidAmountError()
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

    public isPositive(): boolean {
        return this._value > 0
    }

    public isNegative(): boolean {
        return this._value < 0
    }

    public negate(): Amount {
        return new Amount(-this._value)
    }
}
