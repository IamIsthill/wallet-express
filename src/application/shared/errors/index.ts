export class ServiceError extends Error{
    public readonly cause
    constructor(message: string, options?: {cause: unknown}) {
        super(message)
        this.name = 'ServiceError'
        this.cause = options?.cause
        Error.captureStackTrace(this)

    }
}