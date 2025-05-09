import {
    createErrorHandler,
    ServiceError,
    ErrorConstructor,
} from '../../../utils/errors'
import { AccountNotFoundError } from '../../../application/shared/errors'
import { BadRequestError, NotFoundError } from './errors'

export const handleServiceError = createErrorHandler([
    {
        match: AccountNotFoundError as ErrorConstructor<Error>,
        toHttpError: (error) => new NotFoundError(error.message),
    },
    {
        match: ServiceError as ErrorConstructor<Error>,
        toHttpError: (error) => new BadRequestError(error.message),
    },
])
