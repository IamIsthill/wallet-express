import { AccountRepository, Account, Balance } from "../../../domain/finance-management";
import { CreateAccountDto, CreateAccountResponseDto } from "../dto";
import { DomainError, ServiceError, DatabaseError } from "../../../utils/errors";


export class CreateAccountService {
    constructor(private readonly repo: AccountRepository) {}

    public async use(dto: CreateAccountDto) {
        try {
            const newAccount = new Account(undefined, dto.name, dto.balance)
            const savedAccount = await this.repo.createAccount(newAccount)
            const response = new CreateAccountResponseDto(savedAccount)
            return response
        } catch(err: any) {
            if(err instanceof DatabaseError || err instanceof DomainError) {
                throw new ServiceError(err.message, {cause: err})
            } 
            throw new ServiceError(`Unknown error in service layer: ${err.message}`, {cause: err})
        }
    }
}