import { MongooseAccountDocument, MongooseTransactionDocument } from "../types";
import {
  Account,
  Transaction,
  TransactionType,
  Amount,
  Balance,
} from "../../../domain/finance-management";

export class AccountMapper {
  static toAccount(mongooseAccount: MongooseAccountDocument) {
    const { _id, name, balance, transactions } = mongooseAccount;
    const account = new Account(_id.toString(), name, Balance.create(balance));
    if (transactions.length > 0) {
      account.transactions = transactions.map((mt) => this.toTransaction(mt));
    }
    return account;
  }

  static toTransaction(mongooseTransaction: MongooseTransactionDocument) {
    const amt = Amount.create(mongooseTransaction.amount);
    return new Transaction(
      mongooseTransaction._id.toString(),
      TransactionType._create(mongooseTransaction.type),
      amt,
      mongooseTransaction.accountId,
      mongooseTransaction.targetAccountId,
    );
  }
}
