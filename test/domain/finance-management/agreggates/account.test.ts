import { describe, it, expect } from 'vitest'
import { Account, Balance } from '../../../../src/domain/finance-management'
import {
    EntityNotPersistedError,
    InsufficientFundsError,
    InvalidTransferTargetError,
} from '../../../../src/domain/shared/errors'

describe('Account', () => {
    it('should initialize with correct properties', () => {
        const balance = Balance.create(1000)
        const account = new Account('1', 'My Account', balance)

        expect(account.id).toBe('1')
        expect(account.name).toBe('My Account')
        expect(account.balance.value).toBe(1000)
        expect(account.getTransactions()).toHaveLength(0)
    })

    it('should initialize when id is undefined', () => {
        const balance = Balance.create(1000)
        const account = new Account(undefined, 'My Account', balance)

        expect(account.id).toBe(undefined)
        expect(account.name).toBe('My Account')
        expect(account.balance.value).toBe(1000)
        expect(account.getTransactions()).toHaveLength(0)
    })

    it('should not allow access to entity methods if id is undefined', () => {
        const balance = Balance.create(1000)
        const account = new Account(undefined, 'My Account', balance)

        expect(() => account.deposit(100)).toThrow(EntityNotPersistedError)
        expect(() => account.withdraw(100)).toThrow(EntityNotPersistedError)
        expect(() => account.transferFunds(100, '1')).toThrow(
            EntityNotPersistedError
        )
        expect(() => account.recieveTransfer(1, '1')).toThrow(
            EntityNotPersistedError
        )
    })

    it('should deposit an amount and increase balance', () => {
        const account = new Account('1', 'Test', Balance.create(500))
        const tx = account.deposit(200)

        expect(account.balance.value).toBe(700)
        expect(tx.type.value).toBe('income')
        expect(tx.amount.value).toBe(200)
        expect(account.getTransactions()).toContainEqual(tx)
        expect(account.getTransactionIds()).toContainEqual(undefined)
    })

    it('should withdraw an amount and decrease balance', () => {
        const account = new Account('1', 'Test', Balance.create(500))
        const tx = account.withdraw(200)

        expect(account.balance.value).toBe(300)
        expect(tx.type.value).toBe('expense')
        expect(tx.amount.value).toBe(-200)
        expect(account.getTransactionIds()).toContainEqual(undefined)
    })

    it('should throw error when withdrawing more than balance', () => {
        const account = new Account('1', 'Test', Balance.create(100))

        expect(() => account.withdraw(200)).toThrow(InsufficientFundsError)
    })

    it('should transfer funds to another account', () => {
        const account = new Account('1', 'Sender', Balance.create(500))
        const tx = account.transferFunds(100, '2')

        expect(account.balance.value).toBe(400)
        expect(tx.type.value).toBe('outward_transfer')
        expect(tx.targetAccountId).toBe('2')
    })

    it('should throw when transferring to the same account', () => {
        const account = new Account('1', 'Self', Balance.create(500))

        expect(() => account.transferFunds(100, '1')).toThrow(
            InvalidTransferTargetError
        )
    })

    it('should receive transfer and increase balance', () => {
        const account = new Account('2', 'Receiver', Balance.create(300))
        const tx = account.recieveTransfer(200, '1')

        expect(account.balance.value).toBe(500)
        expect(tx.type.value).toBe('inward_transfer')
        expect(tx.targetAccountId).toBe('1')
    })

    it('should set hydrated transactions and transactionIds correctly', () => {
        const account = new Account('1', 'Test', Balance.create(500))
        const tx = account.deposit(100)

        const createdAccount = new Account('2', 'New', Balance.create(300))
        createdAccount.setTransactions([tx])

        expect(createdAccount.getTransactions()).toContainEqual(tx)
        expect(createdAccount.getTransactionIds()).toContain(undefined)
    })

    it('should set only transactionIds when passed string ids', () => {
        const account = new Account('1', 'Test', Balance.create(500))
        account.setTransactions(['tx-id-1', 'tx-id-2'])

        expect(account.getTransactions()).toHaveLength(0)
        expect(account.getTransactionIds()).toEqual(['tx-id-1', 'tx-id-2'])
    })
})
