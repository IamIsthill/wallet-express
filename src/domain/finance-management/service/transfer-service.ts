import { AccountNotFoundError } from '../../../application/shared/errors'
import { InvalidTransferTargetError } from '../../shared/errors'
import { AccountRepository, TransactionRepository } from '../repositories'

export class TransferService {
    constructor(
        private accountRepository: AccountRepository,
        private transactionRepository: TransactionRepository
    ) {}

    async transfer(parameters: {
        sourceAccountId: string
        targetAccountId: string
        amount: number
    }) {
        const { sourceAccountId, targetAccountId, amount } = parameters

        if (sourceAccountId === targetAccountId) {
            throw new InvalidTransferTargetError()
        }

        const [sourceAccount, targetAccount] = await Promise.all([
            this.accountRepository.getById(sourceAccountId),
            this.accountRepository.getById(targetAccountId),
        ])

        if (!sourceAccount || !targetAccount) {
            throw new AccountNotFoundError(
                `[${sourceAccountId}, ${targetAccountId}]`
            )
        }

        const outwardTransaction = sourceAccount.transferFunds(
            amount,
            targetAccount.id!
        )
        const inwardTransaction = targetAccount.recieveTransfer(
            amount,
            sourceAccount.id!
        )

        await Promise.all([
            this.accountRepository.save(targetAccount),
            this.accountRepository.save(sourceAccount),
            this.transactionRepository.save(inwardTransaction),
        ])

        const persistedTransaction =
            await this.transactionRepository.save(outwardTransaction)
        return persistedTransaction
    }
}
