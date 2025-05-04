import {
    EntityNotPersistedError,
    InvalidTransferTargetError,
    MissingTargetAccountError,
    TransactionNotFoundError,
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
        const amt = Amount.create(amount * -1)
        this.decreaseBalance(amt)

        return this.createTransaction(TransactionType.expense(), amt)
    }

    public transferFunds(amount: number, targetAccountId: string) {
        this.ensureIdExists()
        this.ensureDifferentAccounts(targetAccountId)
        const amt = Amount.create(amount * -1)
        this.decreaseBalance(amt)

        return this.createTransaction(
            TransactionType.outward_transfer(),
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
            TransactionType.inward_transfer(),
            amt,
            sourceAccountId
        )
    }

    public rollbackBalance(transaction: Transaction) {
        const rollbackAmount = transaction.amount.negate()
        this.balance = this.balance.apply(rollbackAmount)
    }

    public applyBalanceChange(amount: Amount) {
        this.balance = this.balance.apply(amount)
    }

    public ensureDifferentAccounts(targetAccountId: string) {
        if (this.id === targetAccountId) {
            throw new InvalidTransferTargetError()
        }
    }

    public ensureTargetProvided(targetTransferAccountId?: string) {
        if (!targetTransferAccountId) {
            throw new MissingTargetAccountError()
        }
    }

    public findTransaction(transactionId: string): Transaction {
        const transaction = this.hydratedTransactions.find(
            (item) => item.id == transactionId
        )
        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }
        return transaction
    }

    public ensureIdExists() {
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
        this.balance = this.balance.apply(amount)
    }

    private decreaseBalance(amount: Amount) {
        this.balance = this.balance.apply(amount)
    }
}
