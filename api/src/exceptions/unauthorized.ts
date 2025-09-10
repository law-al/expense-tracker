import { HttpStatus } from '../utils/http-status.js';
import { ApiError } from './index.js';

export class UnAuthorizedError extends ApiError {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED, null);
  }
}
