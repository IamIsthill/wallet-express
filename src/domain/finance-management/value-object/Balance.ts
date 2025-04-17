import { Amount } from "./Amount"

export class Balance {
    private constructor(private readonly _value: number) {}

    static create(value: number): Balance {
        if (value < 0) {
            throw new Error('Balance cannot be less than zero')
        }
        return new Balance(value)
    }

    get value(): number {
        return this._value
    }

    increase(amount: Amount): Balance {
        return new Balance(this._value + amount.value)
    }

    decrease(amount: Amount): Balance {
        if (this._value < amount.value) {
            throw new Error('Insufficient funds')
        }
        return new Balance(this._value - amount.value)
    }

    equals(other: Balance): boolean {
        return this._value === other.value
    }
}
