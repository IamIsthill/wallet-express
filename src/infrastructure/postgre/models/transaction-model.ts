import { sequelize } from '../connection'
import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
} from 'sequelize'
import { IAccountModel } from '../interface'

export class TransactionModel extends Model<
    InferAttributes<TransactionModel>,
    InferCreationAttributes<TransactionModel>
> {
    declare id: CreationOptional<string>
    declare accountId: string
    declare targetAccountId?: string
    declare type: 'transfer' | 'income' | 'expense'
    declare amount: number
    declare targetAccount?: NonAttribute<IAccountModel>
    declare account: NonAttribute<IAccountModel>
    declare updatedAt: CreationOptional<Date>
    declare createdAt: CreationOptional<Date>
}

TransactionModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        accountId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        targetAccountId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM('income', 'transfer', 'expense'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Transactions',
        timestamps: true,
    }
)
