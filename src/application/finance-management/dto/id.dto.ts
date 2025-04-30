import { z } from 'zod'
import { validate } from '../../../utils/lib'

interface IdObject {
    id: string
}

abstract class IdDto<T extends { id: string }> {
    protected readonly id: string

    constructor(request: T, schema: z.AnyZodObject) {
        const data = validate(schema, request)
        this.id = data.id
    }
}

export interface AccountId {
    accountId: string
}

export class AccountIdDto extends IdDto<IdObject> {
    public readonly accountId: string
    constructor(request: AccountId, message?: string) {
        const adaptedRequest: IdObject = { id: request.accountId }
        const schema = z.object({
            id: z.string().min(1, message || 'Account id is required'),
        })
        super(adaptedRequest, schema)
        this.accountId = this.id
    }
}

export interface TransactionId {
    transactionId: string
}

export class TransactionIdDto extends IdDto<IdObject> {
    public readonly transactionId: string
    constructor(request: TransactionId, message?: string) {
        const adaptedRequest: IdObject = { id: request.transactionId }
        const schema = z.object({
            id: z.string().min(1, message || 'Transaction id is required'),
        })
        super(adaptedRequest, schema)
        this.transactionId = this.id
    }
}
