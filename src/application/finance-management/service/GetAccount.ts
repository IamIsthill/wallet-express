import { AccountRepository } from "../../../domain/finance-management";
import { GetAccountDto, GetAccountResponseDto } from "../dto";
import { AccountNotFoundError, ServiceError, UnknownServiceError } from "../../shared/errors";
import { DatabaseError } from "../../../infrastructure/shared/errors";

export class GetAccountService {
    constructor(private readonly repo: AccountRepository) {}

    public async use(dto: GetAccountDto) {
        try {
            const account = await this.repo.getAccountByAccountId(dto.accountId)

            if(!account) {
                throw new AccountNotFoundError(dto.accountId)
            }
    
            const response = new GetAccountResponseDto(account)
            return response
             
        } catch(err) {
            if(err instanceof AccountNotFoundError) {
                throw err
            } else if(err instanceof DatabaseError) {
                throw new ServiceError(err.message, {cause: err})
            } else {
                throw new UnknownServiceError(err)
            }
        }
    }
}