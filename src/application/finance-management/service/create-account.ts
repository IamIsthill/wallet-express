import { AccountRepository, Account } from '../../../domain/finance-management'
import { CreateAccountDto, CreateAccountResponseDto } from '../dto'
import {
    DomainError,
    ServiceError,
    DatabaseError,
    UnknownServiceError,
} from '../../../utils/errors'

export class CreateAccountService {
    constructor(private readonly repo: AccountRepository) {}

    public async use(dto: CreateAccountDto) {
        try {
            const account = new Account(undefined, dto.name, dto.balance)
            const savedAccount = await this.repo.createAccount(account)
            const response = new CreateAccountResponseDto(savedAccount)
            return response
        } catch (error: unknown) {
            if (
                error instanceof DatabaseError ||
                error instanceof DomainError
            ) {
                throw new ServiceError(error.message, { cause: error })
            }
            throw new UnknownServiceError(error)
        }
    }
}
