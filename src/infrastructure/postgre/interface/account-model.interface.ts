import { ITransactionModel } from './transaction-model.interface'

export interface IAccountModel {
    id: string
    name: string
    balance: number
    transactions: ITransactionModel[]
}
