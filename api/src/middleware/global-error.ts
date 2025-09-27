import type { NextFunction, Request, Response } from 'express';
import { ApiError, ErrorCodes } from '../exceptions/index.js';
import { ZodError } from 'zod';
import { createMessageBuilder, fromError } from 'zod-validation-error';
import { ValidationError } from '../exceptions/validation.js';
import { NODE_ENV } from '../secret.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// func for giving custom message for duplicate field value
const duplicateFieldMessage = (field: string | undefined): string => {
  if (!field) return 'Duplicate field value entered';
  const formattedField: Record<string, string> = {
    email: 'Email already exists',
    username: 'Username already exists',
  };
  return formattedField[field] || 'Duplicate field value entered';
};

// Extract duplicate field value from Prisma error message
const extractDuplicateFieldValue = (
  error: PrismaClientKnownRequestError
): string => {
  if (error && error.meta && error.meta.target) {
    const errMessage = error.meta.target as string;
    const errField = errMessage.split('_')[1];
    return duplicateFieldMessage(errField);
  } else {
    return 'Duplicate field value entered';
  }
};

// Handle ZodError
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

// Handle PrismaClientKnownRequestError
const handlePrismaClientKnownRequestError = (
  error: PrismaClientKnownRequestError
): ApiError => {
  let err: ApiError;
  if (error.code === 'P2002') {
    extractDuplicateFieldValue(error);
    err = new ValidationError(
      extractDuplicateFieldValue(error),
      ErrorCodes.VALIDATION_ERROR,
      error
    );
  } else {
    err = new ApiError('Something went wrong', 1006, 500, 1006);
  }

  return err;
};

const devErrorV2 = (err: Error, res: Response) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err || null,
      stack: err.stack,
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err || null,
      stack: err.stack,
    });
  }
};

const prodError = (err: Error, res: Response) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let err: Error = error;
  if (error instanceof ZodError) err = handleZodError(error);
  // prettier-ignore
  if (error.name === 'PrismaClientKnownRequestError')
    err = handlePrismaClientKnownRequestError(error as PrismaClientKnownRequestError );

  if (NODE_ENV === 'development') {
    devErrorV2(err, res);
  } else if (NODE_ENV === 'production') {
    prodError(err, res);
  }
};
