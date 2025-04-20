export class DatabaseError extends Error {
    public readonly cause
    constructor(message: string, options?: { cause: unknown }) {
        super(message)
        this.name = 'DatabaseError'
        this.cause = options?.cause
        Error.captureStackTrace(this)
    }
}

export class UnknownDatabaseError extends DatabaseError {
    constructor(error: unknown) {
        super(`Unknown error in the database`, { cause: error })
        this.name = 'UnknownDatabaseError'
    }
}
