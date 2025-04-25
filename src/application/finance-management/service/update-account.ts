import { AccountRepository } from '../../../domain/finance-management'
import { AccountNotFoundError } from '../../shared/errors'
import {
    ServiceError,
    DatabaseError,
    UnknownServiceError,
} from '../../../utils/errors'
import { UpdateAccountDto, UpdateAccountResponseDto } from '../dto'

export class UpdateAccountService {
    constructor(private readonly repo: AccountRepository) {}

    async use(dto: UpdateAccountDto) {
        try {
            const account = await this.repo.getById(dto.accountId)

            if (!account) {
                throw new AccountNotFoundError(dto.accountId)
            }

            if (dto.name) {
                account.name = dto.name
            }

            await this.repo.save(account)

            return new UpdateAccountResponseDto({
                accountId: dto.accountId,
                name: dto.name,
            })
        } catch (error) {
            if (error instanceof AccountNotFoundError) {
                throw error
            } else if (error instanceof DatabaseError) {
                throw new ServiceError(error.message, { cause: error })
            } else {
                throw new UnknownServiceError(error)
            }
        }
    }
}
