import { ServiceError } from "../../../utils/errors";

export class AccountNotFoundError extends ServiceError {
  constructor(accountId: string) {
    super(`Account with ${accountId} as id was not found`);
    this.name = "AccountNotFoundError";
  }
}
