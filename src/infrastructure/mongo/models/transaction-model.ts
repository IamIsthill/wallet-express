import { Schema, model, Types } from 'mongoose'
import { MongooseTransactionDocument } from '../types'

const transactionSchema = new Schema({
    type: {
        type: String,
        enum: ['income', 'expense', 'transfer'],
        required: true,
    },
    amount: { type: Number, required: true },
    accountId: { type: Types.ObjectId, required: true, ref: 'Account' },
    targetAccountId: { type: Types.ObjectId, required: false, ref: 'Account' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

export const TransactionModel = model<MongooseTransactionDocument>(
    'Transaction',
    transactionSchema
)
