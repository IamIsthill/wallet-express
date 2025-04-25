import { AccountIdDto } from './account-id.dto'

export class DeleteAccountDto extends AccountIdDto {
    constructor(request: { accountId: string }) {
        super(request)
    }
}
