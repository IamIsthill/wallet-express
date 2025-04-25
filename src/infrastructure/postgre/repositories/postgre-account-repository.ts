import { AccountModel, TransactionModel } from '../models'
import {
    Account,
    AccountRepository,
    Transaction,
    Balance,
} from '../../../domain/finance-management'
import { BaseError } from 'sequelize'
import {
    DatabaseError,
    UnknownDatabaseError,
    DomainError,
} from '../../../utils/errors'
import { NotImplementedError } from '../../../utils/errors'
import '../models/associations'
import { Transaction as T } from 'sequelize'
import { AccountMapper, TransactionMapper } from '../mappers'
import { ITransactionModel } from '../interface'

export class PostgreAccountRepository implements AccountRepository {
    private readonly transaction: T | undefined = undefined
    constructor(transaction: T | undefined = undefined) {
        this.transaction = transaction
    }
    async deleteAccount(accountId: string): Promise<void> {
        try {
            await AccountModel.destroy({
                where: {
                    id: accountId,
                },
                transaction: this.transaction,
            })
        } catch (error) {
            if (error instanceof BaseError) {
                throw new DatabaseError(error.message, { cause: error })
            }
            throw new UnknownDatabaseError(error)
        }
    }

    async findTransactionsByAccountId(
        accountId: string
    ): Promise<Transaction[]> {
        throw new NotImplementedError()
    }

    getAllAccounts(): Promise<Account[]> {
        throw new NotImplementedError()
    }

    async save(account: Account): Promise<Account> {
        try {
            const existingAccount = await AccountModel.findByPk(account.id)

            let persistedAccount: AccountModel

            // Update existing, if not, create a new one
            if (existingAccount) {
                existingAccount.name = account.name
                existingAccount.balance = account.balance.value

                await existingAccount.save({ transaction: this.transaction })
                persistedAccount = existingAccount
            } else {
                const newAccount = await AccountModel.create(
                    {
                        name: account.name,
                        balance: account.balance.value,
                    },
                    { transaction: this.transaction }
                )
                persistedAccount = newAccount
            }

            return new Account(
                persistedAccount.id,
                persistedAccount.name,
                Balance.create(persistedAccount.balance)
            )
        } catch (error) {
            if (error instanceof DomainError || error instanceof BaseError) {
                throw new DatabaseError(error.message, { cause: error })
            }
            throw new UnknownDatabaseError(error)
        }
    }

    async getById(
        accountId: string,
        options?: { hydrate?: boolean }
    ): Promise<Account | undefined> {
        try {
            const include = [
                {
                    model: TransactionModel,
                    as: 'transactions',
                    attributes: options?.hydrate ? undefined : ['id'], // Only select 'id' if not hydrating
                },
            ]

            const account = await AccountModel.findByPk(accountId, {
                include: include,
            })
            if (!account) {
                return undefined
            }
            const mappedAccount = AccountMapper.toAccount(account)
            if (options?.hydrate) {
                const transactions = account.transactions.map((tx) =>
                    TransactionMapper.toTransaction(tx)
                )
                mappedAccount.setTransactions(transactions)
            }
            return mappedAccount
        } catch (err) {
            if (err instanceof DomainError || err instanceof BaseError) {
                throw new DatabaseError(err.message, { cause: err })
            }
            throw new UnknownDatabaseError(err)
        }
    }
}
