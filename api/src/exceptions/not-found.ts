import { ApiError, ErrorCodes } from './index.js';

export class NotFoundError extends ApiError {
  constructor(
    message: string,
    errorCode: ErrorCodes = ErrorCodes.RESOURCE_NOT_FOUND
  ) {
    super(message, errorCode, 404, null);
  }
}
