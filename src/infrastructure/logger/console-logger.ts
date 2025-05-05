import { Logger } from '../../application/shared'

export class ConsoleLogger implements Logger {
    debug(message: string, meta?: Record<string, unknown>): void {
        console.debug(
            `[${this.getTime()}] [DEBUG] ${message}`,
            this.stringify(meta)
        )
    }

    error(message: string, meta?: Record<string, unknown>): void {
        console.error(
            `[${this.getTime()}] [ERROR] ${message}`,
            this.stringify(meta)
        )
    }

    info(message: string, meta?: Record<string, unknown>): void {
        console.info(
            `[${this.getTime()}] [INFO] ${message}`,
            this.stringify(meta)
        )
    }

    warn(message: string, meta?: Record<string, unknown>): void {
        console.warn(
            `[${this.getTime()}] [WARN] ${message}`,
            this.stringify(meta)
        )
    }

    private getTime() {
        return new Date().toISOString()
    }

    private stringify(object: unknown) {
        try {
            return JSON.stringify(object)
        } catch {
            return ``
        }
    }
}
