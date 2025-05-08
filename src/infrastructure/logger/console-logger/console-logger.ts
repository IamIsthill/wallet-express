import { Logger } from '../../../application/shared'
import { inspect } from 'node:util'

export class ConsoleLogger implements Logger {
    constructor(private context: Record<string, unknown> = {}) {}
    debug(message: string, meta?: Record<string, unknown>): void {
        console.debug(
            `[${this.getTime()}] [DEBUG] ${message}`,
            this.format(meta)
        )
    }

    error(message: string, meta?: Record<string, unknown>): void {
        console.error(
            `[${this.getTime()}] [ERROR] ${message}`,
            this.format(meta)
        )
    }

    info(message: string, meta?: Record<string, unknown>): void {
        console.info(`[${this.getTime()}] [INFO] ${message}`, this.format(meta))
    }

    warn(message: string, meta?: Record<string, unknown>): void {
        console.warn(`[${this.getTime()}] [WARN] ${message}`, this.format(meta))
    }

    withContext(context: Record<string, unknown>): Logger {
        return new ConsoleLogger({ ...this.context, ...context })
    }

    private getTime() {
        return new Date().toISOString()
    }

    private format(meta?: Record<string, unknown>) {
        if (!meta) {
            meta = {}
        }
        return inspect(
            { ...this.context, ...meta },
            { depth: undefined, colors: false }
        )
    }
}
