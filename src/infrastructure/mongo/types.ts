import { HydratedDocument, Types } from "mongoose";

export interface MongooseTransactionDocument {
  _id: Types.ObjectId;
  type: "income" | "expense" | "transfer";
  amount: number;
  accountId: string;
  targetAccountId?: string;
}

interface MongooseAccount {
  name: string;
  balance: number;
  transactions: MongooseTransactionDocument[];
}

export type MongooseAccountDocument = HydratedDocument<MongooseAccount>;
