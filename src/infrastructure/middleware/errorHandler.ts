import { Response, Request } from "express";
import { AppError, InternalServerError } from "../../interfaces/http/errors";

export const errorHandler = (err: unknown, req: Request, res: Response) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      name: err.name,
      message: err.message,
    });
  } else {
    console.error("Unexpected error: ", err);
    const internalError = new InternalServerError();
    res.status(internalError.statusCode).json({
      name: internalError.name,
      message: internalError.message,
    });
  }
};
