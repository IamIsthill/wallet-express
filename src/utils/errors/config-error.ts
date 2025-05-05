export class ConfigurationError extends Error {
    public readonly cause: unknown
    constructor(message: string, options?: { cause: unknown }) {
        super(message)
        this.name = 'ConfigurationError'
        this.cause = options?.cause
        Error.captureStackTrace(this)
    }
}

export class EnvironmentVariableError extends ConfigurationError {
    constructor() {
        super('Please ensure that your environment variables are correct')
        this.name = 'EnvironmentVariableError'
    }
}
