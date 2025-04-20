import { Schema, model, Types } from 'mongoose'
import { MongooseAccountDocument } from '../types'

const accountSchema = new Schema({
    name: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    transactions: [
        {
            type: Types.ObjectId,
            ref: 'Transaction',
        },
    ],
})

export const AccountModel = model<MongooseAccountDocument>(
    'Account',
    accountSchema
)
