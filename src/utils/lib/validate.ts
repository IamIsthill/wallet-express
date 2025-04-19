import {z} from 'zod'
import { ServiceError } from '../../application/shared/errors';

export function validate<T extends z.ZodRawShape>(schema: z.ZodObject<T>, data: z.infer<z.ZodObject<T>>): z.infer<z.ZodObject<T>> {
    const res = schema.safeParse(data);

    if (!res.success) {
        throw new ServiceError(`Invalid parameters: ${res.error.issues.map(issue => issue.message).join(', ')}`);
    }
    return res.data;
}