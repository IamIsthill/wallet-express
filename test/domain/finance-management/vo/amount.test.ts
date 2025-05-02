import { describe, expect, it } from 'vitest'
import { Amount } from '../../../../src/domain/finance-management'
import { InvalidAmountError } from '../../../../src/domain/shared/errors'

describe('Amount', () => {
    it('should create a valid Amount instance', () => {
        const amt = Amount.create(100)
        expect(amt.value).toBe(100)
    })

    it('should consider amounts with same value equal', () => {
        const a1 = Amount.create(50)
        const a2 = Amount.create(50)
        expect(a1.equals(a2)).toBe(true)
    })

    it('should consider amounts with different values not equal', () => {
        const a1 = Amount.create(30)
        const a2 = Amount.create(70)
        expect(a1.equals(a2)).toBe(false)
    })

    it('should not allow allow zero', () => {
        expect(() => Amount.create(0)).toThrow(InvalidAmountError)
    })

    it('should allow signed values', () => {
        expect(() => Amount.create(-1)).not.toThrow()
        expect(() => Amount.create(+1)).not.toThrow()
    })

    it('negate the values of the original amount', () => {
        const amount1 = Amount.create(-1)
        const expected1 = Amount.create(1)
        const amount2 = Amount.create(1)
        const expected2 = Amount.create(-1)

        expect(amount1.negate()).toStrictEqual(expected1)
        expect(amount2.negate()).toStrictEqual(expected2)
    })

    it('should correctly check the sign of the amount', () => {
        expect(Amount.create(-1).isNegative()).toBe(true)
        expect(Amount.create(1).isNegative()).toBe(false)
        expect(Amount.create(-1).isPositive()).toBe(false)
        expect(Amount.create(1).isPositive()).toBe(true)
    })
})
