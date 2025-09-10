import { ApiError } from './index.js';

export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404, null);
  }
}
