import { AccountRepository } from "../../../domain/account";
import { CreateAccountDto } from "../dto";

export class AddAccountService {
    constructor(private readonly repo: AccountRepository) {}

    async run(account: CreateAccountDto) {
        return await this.repo.create({...account, id:null})
    }
}