import { describe, expect, it } from 'vitest'
import { TransactionType } from '../../../../src/domain/finance-management'

describe('TransactionType', () => {
    it('should create an income transaction type', () => {
        const type = TransactionType.income()
        expect(type.value).toBe('income')
    })

    it('should create an expense transaction type', () => {
        const type = TransactionType.expense()
        expect(type.value).toBe('expense')
    })

    it('should create a inward transfer transaction type', () => {
        const type = TransactionType.inward_transfer()
        expect(type.value).toBe('inward_transfer')
    })
    it('should create a transfer transaction type', () => {
        const type = TransactionType.outward_transfer()
        expect(type.value).toBe('outward_transfer')
    })

    it('should recreate transaction type from _create', () => {
        const type = TransactionType._create('expense')
        expect(type.value).toBe('expense')
    })

    it('should produce distinct instances even for same value', () => {
        const t1 = TransactionType.expense()
        const t2 = TransactionType.expense()

        expect(t1).not.toBe(t2) // not the same instance
        expect(t1.value).toBe(t2.value) // but same internal value
    })

    it('should compare instances of TransactionType', () => {
        const t1 = TransactionType.expense()
        const t2 = TransactionType.income()

        expect(t1.equals(t2)).toBe(false)
        expect(t1.equals(TransactionType.expense())).toBe(true)
    })

    it('should test if transaction type is transfer', () => {
        const t1 = TransactionType.income()
        const t2 = TransactionType.expense()
        const t3 = TransactionType.inward_transfer()
        const t4 = TransactionType.outward_transfer()

        expect(t1.isTransfer()).toBe(false)
        expect(t2.isTransfer()).toBe(false)
        expect(t3.isTransfer()).toBe(true)
        expect(t4.isTransfer()).toBe(true)
    })
})
