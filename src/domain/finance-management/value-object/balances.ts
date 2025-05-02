import { Amount } from './amounts'
import {
    InsufficientFundsError,
    NegativeBalanceError,
} from '../../shared/errors'

export class Balance {
    private constructor(private readonly _value: number) {}

    static create(value: number): Balance {
        if (value < 0) {
            throw new NegativeBalanceError()
        }
        return new Balance(value)
    }

    get value(): number {
        return this._value
    }

    increase(amount: Amount): Balance {
        if (amount.value < 0) {
            throw new InsufficientFundsError()
        }
        return new Balance(this._value + amount.value)
    }

    decrease(amount: Amount): Balance {
        if (amount.value < 0) {
            throw new InsufficientFundsError()
        }
        if (this._value < amount.value) {
            throw new InsufficientFundsError()
        }

        return new Balance(this._value - amount.value)
    }

    apply(amount: Amount): Balance {
        const updatedBalance = this.value + amount.value

        if (updatedBalance < 0) {
            throw new InsufficientFundsError()
        }

        return Balance.create(updatedBalance)
    }

    equals(other: Balance): boolean {
        return this._value === other.value
    }
}
