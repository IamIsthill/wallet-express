export class ServiceError extends Error{
    public readonly cause
    constructor(message: string, options?: {cause: unknown}) {
        super(message)
        this.name = 'ServiceError'
        this.cause = options?.cause
        Error.captureStackTrace(this)
    }
}

export class UnknownServiceError extends ServiceError {
    constructor(err: unknown) {
        super(`Unknown error in service layer`, {cause: err})
    }
}