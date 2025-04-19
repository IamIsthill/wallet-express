import { AccountRepository } from "../../../domain/finance-management";
import { AccountNotFoundError } from "../../shared/errors";
import { DatabaseError, ServiceError, UnknownServiceError } from "../../../utils/errors";
import { DepositToAccountDto, DepositToTransactionResponseDto } from "../dto";

export class DepositToAccountService {
    constructor(private readonly repo: AccountRepository) {}

    async use(dto: DepositToAccountDto) {
        try {
            const account = await this.repo.getAccountByAccountId(dto.accountId)

            if(!account) {
                throw new AccountNotFoundError(dto.accountId)
            }
    
            const depositTransaction = account.deposit(dto.depositAmount)
            const savedTransaction = await this.repo.createTransaction(depositTransaction)
    
            return new DepositToTransactionResponseDto(savedTransaction)
        } catch(err) {
            if(err instanceof AccountNotFoundError) {
                throw err
            } else if(err instanceof DatabaseError) {
                throw new ServiceError(err.message, {cause: err})
            }
            throw new UnknownServiceError(err)
        }
    }
}