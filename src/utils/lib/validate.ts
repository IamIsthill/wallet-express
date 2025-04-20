import { z } from 'zod'
import { ServiceError } from '../errors'

export function validate<T extends z.ZodRawShape>(
    schema: z.ZodObject<T>,
    data: z.infer<z.ZodObject<T>>
): z.infer<z.ZodObject<T>> {
    const response = schema.safeParse(data)

    if (!response.success) {
        throw new ServiceError(
            `Invalid parameters: ${response.error.issues.map((issue) => issue.message).join(', ')}`
        )
    }
    return response.data
}
