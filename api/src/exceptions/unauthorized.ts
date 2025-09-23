import { HttpStatus } from '../utils/http-status.js';
import { ApiError, ErrorCodes } from './index.js';

export class UnAuthorizedError extends ApiError {
  constructor(
    message: string,
    errorCode: ErrorCodes = ErrorCodes.AUTHENTICATION_ERROR
  ) {
    super(message, errorCode, HttpStatus.UNAUTHORIZED, null);
  }
}
