import { describe, expect, it } from 'vitest'
import { Balance, Amount } from '../../../../src/domain/finance-management'
import {
    InsufficientFundsError,
    NegativeBalanceError,
} from '../../../../src/domain/shared/errors'
import { DomainError } from '../../../../src/utils/errors'

describe('Balance', () => {
    it('should create a valid balance', () => {
        const balance = Balance.create(100)
        expect(balance.value).toBe(100)
    })

    it('should throw if balance is negative on creation', () => {
        expect(() => Balance.create(-1)).toThrow(NegativeBalanceError)
    })

    it('should increase balance by amount', () => {
        const balance = Balance.create(100)
        const updated = balance.increase(Amount.create(50))
        expect(updated.value).toBe(150)
    })

    it('should decrease balance by amount', () => {
        const balance = Balance.create(100)
        const updated = balance.decrease(Amount.create(40))
        expect(updated.value).toBe(60)
    })

    it('should throw if decreasing beyond balance', () => {
        const balance = Balance.create(30)
        expect(() => balance.decrease(Amount.create(50))).toThrow(
            InsufficientFundsError
        )
    })

    it('should compare balances correctly', () => {
        const b1 = Balance.create(50)
        const b2 = Balance.create(50)
        const b3 = Balance.create(100)

        expect(b1.equals(b2)).toBe(true)
        expect(b1.equals(b3)).toBe(false)
    })
})

describe('Balance.apply', () => {
    it('should apply a positive amount', () => {
        const balance = Balance.create(100)
        const updated = balance.apply(Amount.create(100))
        expect(updated.value).toBe(200)
    })

    it('should apply a negative amount', () => {
        const balance = Balance.create(100)
        const updated = balance.apply(Amount.create(-100))
        expect(updated.value).toBe(0)
    })

    it('should throw error if resulting balance is negative', () => {
        const balance = Balance.create(100)
        expect(() => balance.apply(Amount.create(-101))).toThrow(DomainError)
    })

    it('should not modify original balance', () => {
        const balance = Balance.create(100)
        balance.apply(Amount.create(50))
        expect(balance.value).toBe(100)
    })
})
