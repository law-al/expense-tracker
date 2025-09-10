import type { NextFunction, Request, Response } from 'express';
import type { ApiError } from '../exceptions/index.js';
import logger from '../utils/logger.js';

export const globalErrorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errorCode = err.errorCode || 1006;
  const error = err.error || null;
  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    error,
  });
};
