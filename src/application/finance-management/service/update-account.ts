import { AccountRepository } from '../../../domain/finance-management'
import { z } from 'zod'
import { validate } from '../../../utils/lib'
import { AccountNotFoundError } from '../../shared/errors'
import {
    ServiceError,
    DatabaseError,
    UnknownServiceError,
} from '../../../utils/errors'

export class UpdateAccountDto {
    public readonly accountId: string
    public readonly name?: string
    private schema = z.object({
        accountId: z
            .string()
            .min(1, 'Account Id is required and must be a string.'),
        name: z
            .string({
                invalid_type_error: 'Name must be a string',
            })
            .optional(),
    })

    constructor(request: { accountId: string; name?: string }) {
        const data = validate(this.schema, request)
        this.accountId = data.accountId
        this.name = data.name
    }
}

export class UpdateAccountResponseDto {
    public readonly accountId: string
    public readonly name?: string
    constructor(response: { accountId: string; name?: string }) {
        this.accountId = response.accountId
        this.name = response.name
    }
}

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
