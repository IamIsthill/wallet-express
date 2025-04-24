import {
    EntityNotPersistedError,
    InvalidTransferTargetError,
    MissingTargetAccountError,
} from '../../shared/errors'
import { Transaction } from '../entities'
import { TransactionType, Amount, Balance } from '../value-object'

export class Account {
    public id: string | undefined
    public name: string
    public balance: Balance
    private hydratedTransactions: Transaction[] = []
    private transactionIds: string[] = []

    constructor(id: string | undefined, name: string, balance: Balance) {
        this.id = id
        this.name = name
        this.balance = balance
    }

    public getTransactions(): Transaction[] {
        return [...this.hydratedTransactions]
    }
    public getTransactionIds(): string[] {
        return [...this.transactionIds]
    }

    public setTransactions(transactions: Transaction[] | string[]) {
        if (typeof transactions[0] == 'string') {
            this.transactionIds = transactions as string[]
            this.hydratedTransactions = []
        } else {
            this.hydratedTransactions = transactions as Transaction[]
            this.transactionIds = (transactions as Transaction[]).map(
                (tx) => tx.id!
            )
        }
    }

    public deposit(amount: number): Transaction {
        this.ensureIdExists()
        const amt = Amount.create(amount)
        this.increaseBalance(amt)

        const transaction = this.createTransaction(
            TransactionType.income(),
            amt
        )
        return transaction
    }

    public addTransaction(transaction: Transaction) {
        this.hydratedTransactions.push(transaction)
        this.transactionIds.push(transaction.id!)
    }

    public withdraw(amount: number): Transaction {
        this.ensureIdExists()
        const amt = Amount.create(amount)
        this.decreaseBalance(amt)

        return this.createTransaction(TransactionType.expense(), amt)
    }

    public transferFunds(amount: number, targetAccountId: string) {
        this.ensureIdExists()
        this.ensureDifferentAccounts(targetAccountId)
        const amt = Amount.create(amount)
        this.decreaseBalance(amt)

        return this.createTransaction(
            TransactionType.transfer(),
            amt,
            targetAccountId
        )
    }

    public recieveTransfer(
        amount: number,
        sourceAccountId: string
    ): Transaction {
        this.ensureIdExists()
        const amt = Amount.create(amount)
        this.increaseBalance(amt)

        return this.createTransaction(
            TransactionType.transfer(),
            amt,
            sourceAccountId
        )
    }

    public changeTransactionTypeOf(
        transactionId: string,
        changeType: TransactionType,
        targetTransferAccountId?: string
    ) {
        this.ensureIdExists()
        const transactionToUpdate = this.findTransaction(transactionId)
        if (!transactionToUpdate) {
            return
        }
        return this.updateTransactionType(
            transactionToUpdate,
            changeType,
            targetTransferAccountId
        )
    }

    private updateTransactionType(
        transactionToUpdate: Transaction,
        changedType: TransactionType,
        targetTransferAccountId?: string
    ) {
        transactionToUpdate.targetAccountId = undefined

        if (changedType.equals(TransactionType.transfer())) {
            this.ensureTargetProvided(targetTransferAccountId)
            this.ensureDifferentAccounts(targetTransferAccountId!)
            transactionToUpdate.targetAccountId = targetTransferAccountId
        }

        transactionToUpdate.type = changedType
        return transactionToUpdate
    }

    private ensureDifferentAccounts(targetAccountId: string) {
        if (this.id === targetAccountId) {
            throw new InvalidTransferTargetError()
        }
    }

    private ensureTargetProvided(targetTransferAccountId?: string) {
        if (!targetTransferAccountId) {
            throw new MissingTargetAccountError()
        }
    }

    private findTransaction(transactionId: string): Transaction | undefined {
        const transaction = this.hydratedTransactions.find(
            (item) => item.id == transactionId
        )
        return transaction
    }

    private ensureIdExists() {
        if (!this.id) {
            throw new EntityNotPersistedError()
        }
    }

    private createTransaction(
        type: TransactionType,
        amount: Amount,
        targetAccountId?: string
    ) {
        const transaction = new Transaction(
            undefined,
            type,
            amount,
            this.id!,
            targetAccountId
        )
        this.addTransaction(transaction)
        return transaction
    }

    private increaseBalance(amount: Amount) {
        this.balance = this.balance.increase(amount)
    }

    private decreaseBalance(amount: Amount) {
        this.balance = this.balance.decrease(amount)
    }
}
