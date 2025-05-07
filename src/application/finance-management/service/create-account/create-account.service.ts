import { Account, UnitOfWork } from '../../../../domain/finance-management'
import {
    CreateAccountDto,
    CreateAccountResponseDto,
} from './create-account.dto'
import {
    DomainError,
    ServiceError,
    DatabaseError,
    UnknownServiceError,
} from '../../../../utils/errors'

export class CreateAccountService {
    constructor(private readonly unitWork: UnitOfWork) {}

    public async use(dto: CreateAccountDto) {
        return await this.unitWork.transact(async () => {
            try {
                const repo = this.unitWork.getAccountRepository()
                const account = new Account(undefined, dto.name, dto.balance)
                const savedAccount = await repo.save(account)
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
        })
    }
}
