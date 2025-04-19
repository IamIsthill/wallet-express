import {
  GetAccountService,
  GetAccountDto,
} from "../../../../application/finance-management";
import { MongoAccountRepository } from "../../../../infrastructure/mongo";
import { Response, Request, NextFunction } from "express";
import { codes } from "../../../../utils/lib";
import {
  AccountNotFoundError,
  ServiceError,
} from "../../../../application/shared/errors";
import { BadRequestError, NotFoundError } from "../../errors";

const repo = new MongoAccountRepository();
const service = new GetAccountService(repo);

export const getAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto = new GetAccountDto(req.params.accountId);
    const account = await service.use(dto);

    res.status(codes.OK).json(account);
  } catch (err) {
    if (err instanceof AccountNotFoundError) {
      next(new NotFoundError(err.message));
    } else if (err instanceof ServiceError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};
