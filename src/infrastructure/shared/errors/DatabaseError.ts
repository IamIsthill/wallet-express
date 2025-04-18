export class DatabaseError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'DatabaseError'
    }
}

export class CannotFindError extends DatabaseError {
    constructor() {
        super('Cannot find data')
        this.name = 'CannotFindError'
    }
}