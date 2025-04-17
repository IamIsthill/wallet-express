import { describe, expect, it } from 'vitest'
import { Amount } from '../../../../src/domain/finance-management'
import { InvalidAmountError } from '../../../../src/domain/shared/errors'

describe('Amount', () => {
  it('should create a valid Amount instance', () => {
    const amt = Amount.create(100)
    expect(amt.value).toBe(100)
  })

  it('should throw error for zero or negative values', () => {
    expect(() => Amount.create(0)).toThrow(InvalidAmountError)
    expect(() => Amount.create(-50)).toThrow(InvalidAmountError)
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
})
