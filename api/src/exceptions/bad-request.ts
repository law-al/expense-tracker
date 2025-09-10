import { ApiError } from './index.js';

export class BadRequestError extends ApiError {
  constructor(message: string, error: any = null) {
    super(message, 400, error);
  }
}
