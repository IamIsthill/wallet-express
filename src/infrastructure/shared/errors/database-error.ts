import { DatabaseError } from '../../../utils/errors'

export class CannotFindError extends DatabaseError {
    constructor() {
        super('Cannot find data')
        this.name = 'CannotFindError'
    }
}
