import { Account } from '../../../domain/finance-management'

export interface ITransactionModel {
    id: string
    accountId: string
    targetAccountId?: string
    type: 'transfer' | 'income' | 'expense'
    amount: number
    createdAt: Date
    updatedAt: Date
    account?: Account
    targetAccount?: Account
}
