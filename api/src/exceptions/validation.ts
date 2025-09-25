import { ApiError, ErrorCodes } from './index.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class ValidationError extends ApiError {
  constructor(message: string, errorCode: ErrorCodes, error: any = null) {
    super(message, errorCode, 400, error);
  }
}
