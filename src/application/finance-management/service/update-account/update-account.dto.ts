import { z } from 'zod'
import { validate } from '../../../../utils/lib'

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
