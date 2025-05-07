import { validate } from '../../../../utils/lib'
import { z } from 'zod'

export class WithdrawFromAccountDto {
    private static schema = z.object({
        accountId: z
            .string()
            .min(1)
            .uuid('Account id is required and must be a uuid'),
        withdrawAmount: z
            .number()
            .min(1, 'Withdraw amount must be greater than zero'),
    })
    public readonly accountId: string
    public readonly withdrawAmount: number

    private constructor(request: {
        accountId: string
        withdrawAmount: number
    }) {
        this.accountId = request.accountId
        this.withdrawAmount = request.withdrawAmount
    }

    static create(request: { accountId: string; withdrawAmount: number }) {
        const data = validate(this.schema, request)
        return new WithdrawFromAccountDto(data)
    }
}
