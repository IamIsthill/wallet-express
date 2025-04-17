import { Transaction } from "../entities";
import { TransactionType, Amount, Balance } from "../value-object";
import { v4 } from "uuid";

export class Account {
    public id: string
    public name: string;
    public balance: Balance;
    public transactions: Transaction[] = []

    constructor(id:string, name: string, balance:Balance) {
        this.id = id
        this.name = name;
        this.balance = balance;
    }

    getTransactions(): Transaction[] {
        return [...this.transactions]
    }

    public deposit(amount: number): Transaction {
        const amt = Amount.create(amount)
        this.increaseBalance(amt)

        const transaction = this.createTransaction(TransactionType.income(), amt, this.id)
        this.transactions.push(transaction)
        return transaction
    }

    public withdraw(amount:number): Transaction {
        const amt = Amount.create(amount)
        this.decreaseBalance(amt)

        const transaction = this.createTransaction(TransactionType.expense(), amt)
        return transaction
    }

    public transferFunds(amount:number, targetAccountId: string) {
        if (this.id === targetAccountId) {
            throw new Error('Transferring to the same account is not allowed');
        }
        const amt = Amount.create(amount)
        this.decreaseBalance(amt)

        const transaction = this.createTransaction(TransactionType.transfer(), amt, targetAccountId)
        return transaction
    }

    public recieveTransfer(amount: number, sourceAccountId: string): Transaction {
        const amt = Amount.create(amount)
        this.increaseBalance(amt)

        const transaction = this.createTransaction(TransactionType.transfer(), amt, sourceAccountId)
        return transaction
    }


    public changeTransactionTypeOf(transactionId: string, newType: TransactionType, targetTransferAccountId?: string) {
        const transactionToUpdate = this.findTransaction(transactionId)
        if(!transactionToUpdate) {
            return undefined
        }
        if(newType.equals(TransactionType.transfer())) {
            if(!targetTransferAccountId) {
                throw new Error('Target transfer account id must be set for transfer transactions')
            }
            transactionToUpdate.targetAccountId = targetTransferAccountId

        } else {
            transactionToUpdate.targetAccountId = undefined
        }
        transactionToUpdate.type = newType
        return transactionToUpdate
    }

    private findTransaction(transactionId: string): Transaction | undefined {
        const transaction = this.transactions.find(item => item.id == transactionId)
        return transaction
    }

    private createTransaction(type: TransactionType, amount: Amount, targetAccountId?:string) {
        const transaction = new Transaction(v4(), type, amount, this.id, targetAccountId)
        this.transactions.push(transaction)
        return transaction
    }

    private increaseBalance(amount: Amount) {
        this.balance = this.balance.increase(amount)
    }

    private decreaseBalance(amount: Amount) {
        this.balance = this.balance.decrease(amount)
    }
}