import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    NonAttribute,
} from 'sequelize'
import { sequelize } from '../connection'
import { TransactionModel } from './transaction-model'

export class AccountModel extends Model<
    InferAttributes<AccountModel>,
    InferCreationAttributes<AccountModel>
> {
    declare id: CreationOptional<string>
    declare name: string
    declare balance: number
    declare transactions: NonAttribute<TransactionModel[]>
}

AccountModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        balance: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Account',
    }
)
