export enum ErrorCodes {
  VALIDATION_ERROR = 1001,
  AUTHENTICATION_ERROR = 1002,
  EMAIL_ALREADY_EXISTS = 1003,
  INVALID_CREDENTIALS = 1004,
  RESOURCE_NOT_FOUND = 1005,
  INTERNAL_SERVER_ERROR = 1006,
  BAD_REQUEST = 1007,
}

export class ApiError extends Error {
  statusCode: number;
  errorCode?: ErrorCodes;
  error: any;
  isOperational: boolean;

  constructor(
    message: string,
    errorCode: ErrorCodes,
    statusCode: number,
    error: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.error = error;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
