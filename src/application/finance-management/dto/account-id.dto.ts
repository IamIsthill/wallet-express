import { z } from 'zod'
import { validate } from '../../../utils/lib'

export abstract class AccountIdDto {
    public readonly accountId: string

    constructor(
        request: { accountId: string },
        message = 'Account id is required'
    ) {
        const schema = z.object({ accountId: z.string().min(1, message) })
        const data = validate(schema, request)
        this.accountId = data.accountId
    }
}

export class DeleteAccountDto extends AccountIdDto {
    constructor(request: { accountId: string }) {
        super(request)
    }
}
