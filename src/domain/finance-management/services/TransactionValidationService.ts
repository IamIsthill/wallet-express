import { Account, Transaction } from "../entities";

export class TransanctionValidationService {
    public static validateExpenseAmount(account: Account, transaction: Transaction):void {
        if(transaction.type.value == 'expense' && transaction.accountId == account.id) {
            if(transaction.amount > account.balance) {
                throw new Error(`Expense amount (${transaction.amount}) exceeds account balance (${account.balance})`)
            }
        }
    }

    public static validateTransferAmount(account: Account, transaction: Transaction ): void {
        if(transaction.type.value !== 'transfer') return

        if(account.id == transaction.targetTransferAccountId) {
            throw new Error('Transferring to the same account is not allowed')
        }
        
        if(account.balance < transaction.amount) {
            throw new Error('Cannot perform transaction as the account has insufficient balance')
        }

    }

}