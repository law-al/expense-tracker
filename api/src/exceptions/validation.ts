import { ApiError, ErrorCodes } from './index.js';

export class ValidationError extends ApiError {
  constructor(message: string, errorCode: ErrorCodes, error: any = null) {
    super(message, errorCode, 400, error);
  }
}
