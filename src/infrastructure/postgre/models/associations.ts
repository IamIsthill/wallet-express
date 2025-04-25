import { TransactionModel } from './transaction-model'
import { AccountModel } from './account-model'

AccountModel.hasMany(TransactionModel, {
    foreignKey: 'accountId',
    as: 'transactions',
    onDelete: 'CASCADE',
})
TransactionModel.belongsTo(AccountModel, {
    foreignKey: 'accountId',
    as: 'account',
})
TransactionModel.belongsTo(AccountModel, {
    foreignKey: 'targetAccountId',
    as: 'targetAccount',
})
