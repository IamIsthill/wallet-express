import { AccountRepository } from "../../../domain/finance-management";
import { CreateAccountDto, CreateAccountResponseDto } from "../dto";
import { DatabaseError } from "../../../infrastructure/shared/errors";
import { DomainError } from "../../../domain/shared/errors";
import { ServiceError } from "../../shared/errors";


export class CreateAccountService {
    constructor(private readonly repo: AccountRepository) {}

    public async use(dto: CreateAccountDto) {
        try {
            const account = await this.repo.createAccount(dto.name, dto.balance)
            const response = new CreateAccountResponseDto(account)
            return response
        } catch(err: any) {
            if(err instanceof DatabaseError || err instanceof DomainError) {
                throw new ServiceError(`Failed to create account: ${err.message}`, {cause: err})
            }
            throw new ServiceError('Failed to create account', {cause: err})
        }
    }
}