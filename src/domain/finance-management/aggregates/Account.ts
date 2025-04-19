import { EntityNotPersistedError, InvalidTransferTargetError, MissingTargetAccountError } from "../../shared/errors";
import { Transaction } from "../entities";
import { TransactionType, Amount, Balance } from "../value-object";
import { v4 } from "uuid";

export class Account {
    public id: string | undefined
    public name: string;
    public balance: Balance;
    public transactions: Transaction[] = []

    constructor(id:string | undefined, name: string, balance:Balance) {
        this.id = id
        this.name = name;
        this.balance = balance;
    }

    getTransactions(): Transaction[] {
        return [...this.transactions]
    }
    

    public deposit(amount: number): Transaction {
        this.ensureIdExists()
        const amt = Amount.create(amount)
        this.increaseBalance(amt)

        const transaction = this.createTransaction(TransactionType.income(), amt)
        return transaction
    }

    public withdraw(amount:number): Transaction {
        this.ensureIdExists()
        const amt = Amount.create(amount)
        this.decreaseBalance(amt)

        return this.createTransaction(TransactionType.expense(), amt)
    }

    public transferFunds(amount:number, targetAccountId: string) {
        this.ensureIdExists()
        this.ensureDifferentAccounts(targetAccountId)
        const amt = Amount.create(amount)
        this.decreaseBalance(amt)

        return this.createTransaction(TransactionType.transfer(), amt, targetAccountId)
    }

    public recieveTransfer(amount: number, sourceAccountId: string): Transaction {
        this.ensureIdExists()
        const amt = Amount.create(amount)
        this.increaseBalance(amt)

        return this.createTransaction(TransactionType.transfer(), amt, sourceAccountId)
    }


    public changeTransactionTypeOf(transactionId: string, newType: TransactionType, targetTransferAccountId?: string) {
        this.ensureIdExists()
        const transactionToUpdate = this.findTransaction(transactionId)
        if(!transactionToUpdate) {
            return undefined
        }
        return this.updateTransactionType(transactionToUpdate, newType, targetTransferAccountId)
    }

    private updateTransactionType(transactionToUpdate: Transaction, newType: TransactionType, targetTransferAccountId?: string){
        transactionToUpdate.targetAccountId = undefined

        if(newType.equals(TransactionType.transfer())) {
            this.ensureTargetProvided(targetTransferAccountId)
            this.ensureDifferentAccounts(targetTransferAccountId!)
            transactionToUpdate.targetAccountId = targetTransferAccountId
        } 

        transactionToUpdate.type = newType
        return transactionToUpdate
    }

    private ensureDifferentAccounts(targetAccountId: string){
        if (this.id === targetAccountId) {
            throw new InvalidTransferTargetError
        }
    }
    
    private ensureTargetProvided(targetTransferAccountId?: string){
        if(!targetTransferAccountId) {
            throw new MissingTargetAccountError
        }
    }

    private findTransaction(transactionId: string): Transaction | undefined {
        const transaction = this.transactions.find(item => item.id == transactionId)
        return transaction
    }

    private ensureIdExists() {
        if(!this.id) {
            throw new EntityNotPersistedError()
        }
    }


    private createTransaction(type: TransactionType, amount: Amount, targetAccountId?:string) {
        const transaction = new Transaction(v4(), type, amount, this.id!, targetAccountId)
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