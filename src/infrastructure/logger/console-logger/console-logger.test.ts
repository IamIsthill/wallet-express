import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { ConsoleLogger } from './console-logger'

describe('ConsoleLogger', () => {
    const logger = new ConsoleLogger()

    beforeEach(() => {
        vi.spyOn(console, 'debug')
        vi.spyOn(console, 'info')
        vi.spyOn(console, 'warn')
        vi.spyOn(console, 'error')
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('calls console.debug with formatted message and meta', () => {
        logger.debug('Test debug', { test: true })
        expect(console.debug).toHaveBeenCalledWith(
            expect.stringContaining('[DEBUG] Test debug'),
            expect.anything()
        )
    })

    it('calls console.info with formatted message', () => {
        logger.info('Test info', { user: 'abc' })
        expect(console.info).toHaveBeenCalledWith(
            expect.stringContaining('[INFO] Test info'),
            expect.anything()
        )
    })

    it('handles undefined meta gracefully', () => {
        expect(() => logger.warn('Test warn')).not.toThrow()
        expect(console.warn).toHaveBeenCalled()
    })

    it('handles stringifying circular meta', () => {
        const circular: Record<string, unknown> = {}
        circular.self = circular
        expect(() => logger.error('Test error', circular)).not.toThrow()
        expect(console.error).toHaveBeenCalled()
    })
})

describe('ConsoleLogger.withContext', () => {
    const baseLogger = new ConsoleLogger()
    const logger = baseLogger.withContext({ requestId: 'sample' })

    beforeEach(() => {
        vi.spyOn(console, 'debug')
        vi.spyOn(console, 'info')
        vi.spyOn(console, 'warn')
        vi.spyOn(console, 'error')
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('calls console.debug with formatted message and meta', () => {
        logger.debug('Test debug', { test: true })
        expect(console.debug).toHaveBeenCalledWith(
            expect.stringContaining('[DEBUG] Test debug'),
            expect.stringContaining('requestId')
        )
    })

    it('calls console.info with formatted message', () => {
        logger.info('Test info', { user: 'abc' })
        expect(console.info).toHaveBeenCalledWith(
            expect.stringContaining('[INFO] Test info'),
            expect.stringContaining('requestId')
        )
    })

    it('handles undefined meta gracefully', () => {
        expect(() => logger.warn('Test warn')).not.toThrow()
        expect(console.warn).toHaveBeenCalled()
    })

    it('handles stringifying circular meta', () => {
        const circular: Record<string, unknown> = {}
        circular.self = circular
        expect(() => logger.error('Test error', circular)).not.toThrow()
        expect(console.error).toHaveBeenCalled()
    })
})
