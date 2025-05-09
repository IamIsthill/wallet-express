import { Logger } from '../../../application/shared'
import { vi } from 'vitest'

export const mockLogger: Logger = {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    withContext: vi.fn(),
}
