import { ApiError, ErrorCodes } from './index.js';
/* eslint-disable @typescript-eslint/no-explicit-any */
export class BadRequestError extends ApiError {
  constructor(
    message: string,
    errorCode: ErrorCodes = ErrorCodes.BAD_REQUEST,
    error: any = null
  ) {
    super(message, errorCode, 400, error);
  }
}
