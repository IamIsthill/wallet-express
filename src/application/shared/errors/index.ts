export class ServiceError extends Error{
    public readonly cause
    constructor(message: string, options?: {cause: Error}) {
        super(message)
        this.name = 'ServiceError'
        this.cause = options?.cause

    }
}