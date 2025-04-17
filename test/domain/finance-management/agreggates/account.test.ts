import { describe, it, expect } from 'vitest'
import { Account, Balance, TransactionType } from '../../../../src/domain/finance-management'
import { InsufficientFundsError, InvalidTransferTargetError, MissingTargetAccountError, TargetAccountNotAllowedError } from '../../../../src/domain/shared/errors'

describe('Account', () => {
  it('should initialize with correct properties', () => {
    const balance = Balance.create(1000)
    const account = new Account('1', 'My Account', balance)

    expect(account.id).toBe('1')
    expect(account.name).toBe('My Account')
    expect(account.balance.value).toBe(1000)
    expect(account.getTransactions()).toHaveLength(0)
  })

  it('should deposit an amount and increase balance', () => {
    const account = new Account('1', 'Test', Balance.create(500))
    const tx = account.deposit(200)

    expect(account.balance.value).toBe(700)
    expect(tx.type.value).toBe('income')
    expect(tx.amount.value).toBe(200)
    expect(account.getTransactions()).toContainEqual(tx)
  })

  it('should withdraw an amount and decrease balance', () => {
    const account = new Account('1', 'Test', Balance.create(500))
    const tx = account.withdraw(200)

    expect(account.balance.value).toBe(300)
    expect(tx.type.value).toBe('expense')
    expect(tx.amount.value).toBe(200)
  })

  it('should throw error when withdrawing more than balance', () => {
    const account = new Account('1', 'Test', Balance.create(100))

    expect(() => account.withdraw(200)).toThrow(InsufficientFundsError)
  })

  it('should transfer funds to another account', () => {
    const account = new Account('1', 'Sender', Balance.create(500))
    const tx = account.transferFunds(100, '2')

    expect(account.balance.value).toBe(400)
    expect(tx.type.value).toBe('transfer')
    expect(tx.targetAccountId).toBe('2')
  })

  it('should throw when transferring to the same account', () => {
    const account = new Account('1', 'Self', Balance.create(500))

    expect(() => account.transferFunds(100, '1')).toThrow(InvalidTransferTargetError)
  })

  it('should receive transfer and increase balance', () => {
    const account = new Account('2', 'Receiver', Balance.create(300))
    const tx = account.recieveTransfer(200, '1')

    expect(account.balance.value).toBe(500)
    expect(tx.type.value).toBe('transfer')
    expect(tx.targetAccountId).toBe('1')
  })

  it('should change transaction type to transfer with target id', () => {
    const account = new Account('1', 'Test', Balance.create(500))
    const tx = account.deposit(100)
    const updatedTx = account.changeTransactionTypeOf(tx.id, TransactionType.transfer(), '2')

    expect(updatedTx?.type.value).toBe('transfer')
    expect(updatedTx?.targetAccountId).toBe('2')
  })

  it('should not update if transaction is not found', () => {
    const account = new Account('1', 'Test', Balance.create(500))
    const result = account.changeTransactionTypeOf('non-existent', TransactionType.transfer(), '2')

    expect(result).toBeUndefined()
  })

  it('should throw error if transfer type is missing target account', () => {
    const account = new Account('1', 'Test', Balance.create(500))
    const tx = account.deposit(100)

    expect(() => account.changeTransactionTypeOf(tx.id, TransactionType.transfer())).toThrow(MissingTargetAccountError)
  })


})