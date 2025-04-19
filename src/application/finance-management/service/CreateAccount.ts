import { AccountRepository, Account } from "../../../domain/finance-management";
import { CreateAccountDto, CreateAccountResponseDto } from "../dto";
import { DomainError, ServiceError, DatabaseError, UnknownServiceError } from "../../../utils/errors";


export class CreateAccountService {
    constructor(private readonly repo: AccountRepository) {}

    public async use(dto: CreateAccountDto) {
        try {
            const newAccount = new Account(undefined, dto.name, dto.balance)
            const savedAccount = await this.repo.createAccount(newAccount)
            const response = new CreateAccountResponseDto(savedAccount)
            return response
        } catch(err: unknown) {
            if(err instanceof DatabaseError || err instanceof DomainError) {
                throw new ServiceError(err.message, {cause: err})
            } 
            throw new UnknownServiceError(err)
        }
    }
}