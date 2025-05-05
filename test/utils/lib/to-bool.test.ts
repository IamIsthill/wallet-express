import { describe, it, expect } from 'vitest'
import { toBool } from '../../../src/utils/lib'

describe('toBool util', () => {
    it('string true | TRUE | trUe -> return true', () => {
        expect(toBool('true')).toBe(true)
        expect(toBool('tRue')).toBe(true)
        expect(toBool('TRUE')).toBe(true)
    })
    it('undefined -> false', () => {
        expect(toBool()).toBe(false)
    })
    it('anything else -> false', () => {
        expect(toBool('false')).toBe(false)
        expect(toBool('falsE')).toBe(false)
        expect(toBool('notvalid')).toBe(false)
        expect(toBool(1)).toBe(false)
    })
})
