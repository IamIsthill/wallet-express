import { AccountModel } from "../models";
import {
  Account,
  AccountRepository,
  Transaction,
} from "../../../domain/finance-management";
import { AccountMapper } from "../mappers/AccountMapper";
import mongoose from "mongoose";
import { CannotFindError } from "../../shared/errors";
import { NotImplemented } from "../../../utils/errors";
import {
  DomainError,
  DatabaseError,
  UnknownDatabaseError,
} from "../../../utils/errors";
import { AccountNotFoundError } from "../../../application/shared/errors";

export class MongoAccountRepository implements AccountRepository {
  async createAccount(account: Account) {
    try {
      const mongooseAccount = await AccountModel.create({
        name: account.name,
        balance: account.balance.value,
        transactions: [],
      });
      return AccountMapper.toAccount(mongooseAccount);
    } catch (err) {
      if (err instanceof mongoose.Error || err instanceof DomainError) {
        throw new DatabaseError(err.message, { cause: err });
      }
      throw new UnknownDatabaseError(err);
    }
  }

  async findTransactionsByAccountId(accountId: string) {
    try {
      const mongooseAccount = await AccountModel.findById(accountId).lean();

      if (!mongooseAccount) {
        throw new CannotFindError();
      }

      return mongooseAccount.transactions.map((transaction) =>
        AccountMapper.toTransaction(transaction),
      );
    } catch (err) {
      if (err instanceof mongoose.Error || err instanceof DomainError) {
        throw new DatabaseError(err.message, { cause: err });
      }
      throw err;
    }
  }

  async deleteAccount(accountId: string): Promise<void> {
    throw new NotImplemented();
  }

  deleteTransaction(account: Account, transactionId: string): Promise<void> {
    throw new NotImplemented();
  }

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    try {
      const account = await AccountModel.findByIdAndUpdate(
        transaction.accountId,
        {
          $push: {
            transactions: {
              type: transaction.type,
              amount: transaction.amount,
              accountId: transaction.accountId,
            },
          },
        },
      );
      if (!account) {
        throw new AccountNotFoundError(transaction.accountId);
      }
      const lastTransaction =
        account.transactions[account.transactions.length - 1];
      return AccountMapper.toTransaction(lastTransaction);
    } catch (err) {
      if (err instanceof mongoose.Error || err instanceof DomainError) {
        throw new DatabaseError(err.message, { cause: err });
      }
      throw new UnknownDatabaseError(err);
    }
  }

  async getAccountByAccountId(accountId: string): Promise<Account | undefined> {
    try {
      const account = await AccountModel.findById(accountId).lean();

      if (!account) return undefined;

      return AccountMapper.toAccount(account);
    } catch (err) {
      if (err instanceof mongoose.Error || err instanceof DomainError) {
        throw new DatabaseError(err.message, { cause: err });
      }
      throw new UnknownDatabaseError(err);
    }
  }
  getAllAccounts(): Promise<Account[]> {
    throw new NotImplemented();
  }
  updateAccount(account: Account): Promise<Account> {
    throw new NotImplemented();
  }
  getTransactionByTransactionId(
    transactionId: string,
  ): Promise<Transaction | undefined> {
    throw new NotImplemented();
  }

  updateTransaction(
    account: Account,
    updatedTransaction: Transaction,
  ): Promise<Transaction> {
    throw new NotImplemented();
  }
}
