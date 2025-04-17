import {Schema, model} from "mongoose";
import { MongooseAccountDocument } from "../types";

const transactionSchema = new Schema({
    type: { type: String, enum: ['income', 'expense', 'transfer'], required: true },
    amount: { type: Number, required: true },
    accountId: { type: String, required: true }, // Store accountId
    targetAccountId: { type: String, required: false },
});

const accountSchema = new Schema({
    name: { type: String, required: true },
    balance: { type: Number, required: true, default: 0 },
    transactions: [transactionSchema], 
});



export const AccountModel = model<MongooseAccountDocument>('Account', accountSchema)
