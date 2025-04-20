export class NotImplementedError extends Error {
    constructor(message = 'This is not implemented yet') {
        super(message)
        this.name = 'NotImplementedError'
    }
}
