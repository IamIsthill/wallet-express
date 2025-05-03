import { describe, it, expect, beforeEach } from 'vitest'
import {
    Transaction,
    TransactionType,
    Amount,
} from '../../../../src/domain/finance-management'
import {
    DifferentTargetAccountIdError,
    TargetAccountNotAllowedError,
    TargetAccountNotDefinedError,
} from '../../../../src/domain/shared/errors'

describe('Transaction', () => {
    it('should correctly create a transaction with income type', () => {
        const transaction = new Transaction(
            'tx-id-1',
            TransactionType.income(),
            Amount.create(200),
            'acct-id'
        )

        expect(transaction).toMatchObject({
            id: 'tx-id-1',
            amount: expect.objectContaining({ value: 200 }),
            type: expect.objectContaining({ value: 'income' }),
            accountId: 'acct-id',
            targetAccountId: undefined,
        })
    })

    it('should correctly create a transaction with expense type', () => {
        const transaction = new Transaction(
            'tx-id-2',
            TransactionType.expense(),
            Amount.create(-50),
            'acct-id'
        )

        expect(transaction).toMatchObject({
            id: 'tx-id-2',
            amount: expect.objectContaining({ value: -50 }),
            type: expect.objectContaining({ value: 'expense' }),
            accountId: 'acct-id',
            targetAccountId: undefined,
        })
    })

    it('should correctly create a transaction with inward transfer type', () => {
        const transaction = new Transaction(
            'tx-id-3',
            TransactionType.inward_transfer(),
            Amount.create(100),
            'acct-id',
            'acct-id2'
        )

        expect(transaction).toMatchObject({
            id: 'tx-id-3',
            amount: expect.objectContaining({ value: 100 }),
            type: expect.objectContaining({ value: 'inward_transfer' }),
            accountId: 'acct-id',
            targetAccountId: 'acct-id2',
        })
    })

    it('should correctly create a transaction with outward transfer type', () => {
        const transaction = new Transaction(
            'tx-id-4',
            TransactionType.outward_transfer(),
            Amount.create(-100),
            'acct-id',
            'acct-id2'
        )

        expect(transaction).toMatchObject({
            id: 'tx-id-4',
            amount: expect.objectContaining({ value: -100 }),
            type: expect.objectContaining({ value: 'outward_transfer' }),
            accountId: 'acct-id',
            targetAccountId: 'acct-id2',
        })
    })
})

describe('Transaction Type changes', () => {
    let incomeTransaction: Transaction
    let expenseTransaction: Transaction
    let inwardTransaction: Transaction
    let outwardTransaction: Transaction

    beforeEach(() => {
        incomeTransaction = new Transaction(
            'tx-1',
            TransactionType.income(),
            Amount.create(100),
            'acct-id'
        )
        expenseTransaction = new Transaction(
            'tx-2',
            TransactionType.expense(),
            Amount.create(-100),
            'acct-id'
        )
        inwardTransaction = new Transaction(
            'tx-3',
            TransactionType.inward_transfer(),
            Amount.create(100),
            'acct-id',
            'acct-id2'
        )
        outwardTransaction = new Transaction(
            'tx-4',
            TransactionType.outward_transfer(),
            Amount.create(-100),
            'acct-id',
            'acct-id2'
        )
    })
    it('should correctly change the transaction type from outward to income', () => {
        outwardTransaction.changeType(TransactionType.income())
        expect(outwardTransaction).toMatchObject({
            type: expect.objectContaining({ value: 'income' }),
            targetAccountId: undefined,
        })
    })

    it('should correctly change the transaction type from outward to expense', () => {
        outwardTransaction.changeType(TransactionType.expense())
        expect(outwardTransaction).toMatchObject({
            type: expect.objectContaining({ value: 'expense' }),
            targetAccountId: undefined,
        })
    })

    it('should correctly change the transaction type from outward to inward', () => {
        outwardTransaction.changeType(
            TransactionType.inward_transfer(),
            'acct-id2'
        )
        expect(outwardTransaction).toMatchObject({
            type: expect.objectContaining({ value: 'inward_transfer' }),
            targetAccountId: 'acct-id2',
        })
    })

    it('should correctly change the transaction type from inward to outward', () => {
        inwardTransaction.changeType(
            TransactionType.outward_transfer(),
            'acct-id2'
        )
        expect(inwardTransaction).toMatchObject({
            type: expect.objectContaining({ value: 'outward_transfer' }),
            targetAccountId: 'acct-id2',
        })
    })

    it('should correctly change the transaction type from inward to expense', () => {
        inwardTransaction.changeType(TransactionType.expense())
        expect(inwardTransaction).toMatchObject({
            type: expect.objectContaining({ value: 'expense' }),
            targetAccountId: undefined,
        })
    })

    it('should correctly change the transaction type from inward to income', () => {
        inwardTransaction.changeType(TransactionType.income())
        expect(inwardTransaction).toMatchObject({
            type: expect.objectContaining({ value: 'income' }),
            targetAccountId: undefined,
        })
    })

    it('should correctly change the transaction type from income to expense', () => {
        incomeTransaction.changeType(TransactionType.expense())
        expect(incomeTransaction).toMatchObject({
            type: expect.objectContaining({ value: 'expense' }),
            targetAccountId: undefined,
        })
    })

    it('should correctly change the transaction type from income to outward', () => {
        incomeTransaction.changeType(
            TransactionType.outward_transfer(),
            'acct-id2'
        )
        expect(incomeTransaction).toMatchObject({
            type: expect.objectContaining({ value: 'outward_transfer' }),
            targetAccountId: 'acct-id2',
        })
    })

    it('should correctly change the transaction type from income to inward', () => {
        incomeTransaction.changeType(
            TransactionType.inward_transfer(),
            'acct-id2'
        )
        expect(incomeTransaction).toMatchObject({
            type: expect.objectContaining({ value: 'inward_transfer' }),
            targetAccountId: 'acct-id2',
        })
    })

    it('should correctly change the transaction type from expense to inward', () => {
        expenseTransaction.changeType(
            TransactionType.inward_transfer(),
            'acct-id2'
        )
        expect(expenseTransaction).toMatchObject({
            type: expect.objectContaining({ value: 'inward_transfer' }),
            targetAccountId: 'acct-id2',
        })
    })

    it('should correctly change the transaction type from expense to outward', () => {
        expenseTransaction.changeType(
            TransactionType.outward_transfer(),
            'acct-id2'
        )
        expect(expenseTransaction).toMatchObject({
            type: expect.objectContaining({ value: 'outward_transfer' }),
            targetAccountId: 'acct-id2',
        })
    })
    it('should correctly change the transaction type from expense to income', () => {
        expenseTransaction.changeType(TransactionType.income())
        expect(expenseTransaction).toMatchObject({
            type: expect.objectContaining({ value: 'income' }),
            targetAccountId: undefined,
        })
    })

    it('should throw error if different target account id is provided', () => {
        const transaction = new Transaction(
            'tx-id-4',
            TransactionType.outward_transfer(),
            Amount.create(-100),
            'acct-id',
            'acct-id2'
        )

        expect(() =>
            transaction.changeType(TransactionType.inward_transfer(), 'diff')
        ).toThrow(DifferentTargetAccountIdError)
    })

    it('changing to a transfer transaction but target account id is not provided -> throw error', () => {
        const transaction = new Transaction(
            'tx-id-4',
            TransactionType.outward_transfer(),
            Amount.create(-100),
            'acct-id',
            'acct-id2'
        )

        expect(() =>
            transaction.changeType(TransactionType.inward_transfer())
        ).toThrow(TargetAccountNotDefinedError)
    })

    it('changing to a income/expense transaction and target account id is  provided -> throw error', () => {
        const transaction = new Transaction(
            'tx-id-4',
            TransactionType.outward_transfer(),
            Amount.create(-100),
            'acct-id',
            'acct-id2'
        )

        expect(() =>
            transaction.changeType(TransactionType.income(), 'ac')
        ).toThrow(TargetAccountNotAllowedError)
    })
})
