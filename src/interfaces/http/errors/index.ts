import { codes } from "../../../utils/lib";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype); // Recommended for custom errors in ES6
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, codes.NOT_FOUND);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, codes.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, codes.UNAUTHORIZED);
  }
}
export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, codes.INTERNAL_SERVER);
  }
}
