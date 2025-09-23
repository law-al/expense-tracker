import type { NextFunction, Request, Response } from 'express';
import { ApiError, ErrorCodes } from '../exceptions/index.js';
import logger from '../utils/logger.js';
import { ZodError } from 'zod';
import { createMessageBuilder, fromError } from 'zod-validation-error';
import { ValidationError } from '../exceptions/validation.js';
import { NODE_ENV } from '../../secret.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const handleZodError = (error: ZodError): ApiError => {
  const validationError = fromError(error, {
    messageBuilder: createMessageBuilder({
      includePath: false,
      maxIssuesInMessage: NODE_ENV === 'development' ? 10 : 1,
      prefix: undefined,
      issueSeparator: NODE_ENV === 'development' ? ', ' : '',
    }),
  });

  const err = new ValidationError(
    validationError.message,
    ErrorCodes.VALIDATION_ERROR
  );
  return err;
};

const handlePrismaClientKnownRequestError = (
  error: PrismaClientKnownRequestError
): ApiError => {
  console.log(error.code);

  let err: ApiError;
  if (error.code === 'P2002') {
    err = new ValidationError(
      'Duplicate field value entered',
      ErrorCodes.VALIDATION_ERROR,
      error
    );
  } else {
    err = new ApiError('Something went wrong', 1006, 500, 1006);
  }

  return err;
};

const devError = (err: ApiError, res: Response) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(error);
  let err: ApiError | undefined = undefined;
  if (error instanceof ZodError) err = handleZodError(error);
  if (error.name === 'PrismaClientKnownRequestError')
    err = handlePrismaClientKnownRequestError(
      error as PrismaClientKnownRequestError
    );
  if (error instanceof ApiError) err = error;

  if (process.env.NODE_ENV === 'development') {
    if (err) {
      devError(err, res);
    } else {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        errorCode: 1006,
        error: error || null,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  } else if (process.env.NODE_ENV === 'production') {
    logger.error('Error: ', err);
  }
};

/*
export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // const statusCode = err.statusCode || 500;
  // const message = err.message || 'Internal Server Error';
  // const errorCode = err.errorCode || 1006;
  // const error = err.error || null;

  console.log(error);
  let err: ApiError | undefined = undefined;
  if (error instanceof ZodError) err = handleZodError(error);
  if (error instanceof ApiError) err = error;

  if (process.env.NODE_ENV === 'development' && err) {
    devError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    logger.error('Error: ', err);
  }
};
*/
