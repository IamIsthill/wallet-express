import { describe, expect, it } from 'vitest'
import { ServiceError } from '../../../src/utils/errors'
import { z } from 'zod'
import { validate } from '../../../src/utils/lib'

describe('Custom Validator function for zod', () => {
    const schema = z.object({
        given: z.string(),
    })

    it('returns the validated data', () => {
        expect(validate(schema, { given: '122' })).toStrictEqual({
            given: '122',
        })
    })
    it('should throw Service Error if there is any unexpected fields', () => {
        expect(() =>
            validate(schema, { given: '122', unexpected: 'unexpected' })
        ).toThrow(ServiceError)
    })
})
