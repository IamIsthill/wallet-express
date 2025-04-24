import { AccountRepository } from '../../../domain/finance-management'
import { GetAccountDto, GetAccountResponseDto } from '../dto'
import { AccountNotFoundError } from '../../shared/errors'
import {
    ServiceError,
    UnknownServiceError,
    DatabaseError,
} from '../../../utils/errors'

export class GetAccountService {
    constructor(private readonly repo: AccountRepository) {}

    public async use(dto: GetAccountDto) {
        try {
            const account = await this.repo.getById(dto.accountId)

            if (!account) {
                throw new AccountNotFoundError(dto.accountId)
            }

            const response = new GetAccountResponseDto(account)
            return response
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
