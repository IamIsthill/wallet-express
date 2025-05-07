import { AccountRepository } from '../../../../domain/finance-management'
import { AccountNotFoundError } from '../../../shared/errors'
import {
    DatabaseError,
    ServiceError,
    UnknownServiceError,
} from '../../../../utils/errors'
import { DeleteAccountDto } from './delete-account.dto'

export class DeleteAccountService {
    constructor(private readonly repo: AccountRepository) {}

    async use(dto: DeleteAccountDto): Promise<void> {
        try {
            const account = await this.repo.getById(dto.accountId)
            if (!account) {
                throw new AccountNotFoundError(dto.accountId)
            }
            await this.repo.delete(account.id!)
        } catch (error) {
            if (error instanceof AccountNotFoundError) {
                throw error
            } else if (error instanceof DatabaseError) {
                throw new ServiceError(error.message, { cause: error })
            }
            throw new UnknownServiceError(error)
        }
    }
}
