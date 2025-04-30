import { AccountId, AccountIdDto } from './id.dto'

export class DeleteAccountDto extends AccountIdDto {
    constructor(request: AccountId) {
        super(request, 'Account id is required to delete an account')
    }
}
