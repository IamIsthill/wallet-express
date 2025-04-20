import { HydratedDocument, Types } from 'mongoose'

interface MongooseTransaction {
    type: 'income' | 'expense' | 'transfer'
    amount: number
    accountId: string
    targetAccountId?: string
    createdAt: Date
    updatedAt: Date
}

export type MongooseTransactionDocument = HydratedDocument<MongooseTransaction>

interface MongooseAccount {
    name: string
    balance: number
    transactions: Types.ObjectId[]
}

interface MongooseAccountPopulated {
    name: string
    balance: number
    transactions: MongooseTransactionDocument[]
}

export type MongooseAccountDocument = HydratedDocument<MongooseAccount>
export type MongooseAccountDocumentPopulated =
    HydratedDocument<MongooseAccountPopulated>
