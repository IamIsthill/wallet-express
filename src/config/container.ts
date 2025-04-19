import { MongoAccountRepository } from "../infrastructure/mongo";
import { AddAccountService } from "../application/account/service";

const accountRepo = new MongoAccountRepository();

const accountService = {
  addAccount: new AddAccountService(accountRepo),
};

export const container = {
  accountService,
  accountRepo,
};
