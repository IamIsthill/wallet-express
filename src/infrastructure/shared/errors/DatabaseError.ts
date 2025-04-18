export class DatabaseError extends Error {
    public readonly cause
    constructor(message: string, options?: {cause: Error}) {
        super(message)
        this.name = 'DatabaseError'
        this.cause = options?.cause
    }
}

export class CannotFindError extends DatabaseError {
    constructor() {
        super('Cannot find data')
        this.name = 'CannotFindError'
    }
}