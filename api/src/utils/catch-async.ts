import type { NextFunction, Request, Response } from 'express';
import logger from './logger.js';
import { ApiError, ErrorCodes } from '../exceptions/index.js';
import z, { ZodError } from 'zod';
import { ValidationError } from '../exceptions/validation.js';
import { Prisma } from '@prisma/client';

export const asyncHandler = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      let exceptions: ApiError | null = null;
      if (error instanceof ApiError) {
        exceptions = error;
      } else {
        if (error instanceof ZodError) {
          // SECTION: Handle Zod validation errors

          const errMessage = JSON.parse(error.message)
            .map((e: any) => `${e.path.join('.')}: ${e.message}`)
            .join(', ');
          exceptions = new ValidationError(
            errMessage || `Validation Error`,
            ErrorCodes.VALIDATION_ERROR,
            error
          );
        } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // SECTION: Handle Prisma ClientKnownRequest errors

          if (error.code === 'P2002') {
            if (
              typeof error.meta?.target === 'string' &&
              error.meta?.target?.includes('email')
            ) {
              // SECTION: Handle unique constraint violation for email field

              exceptions = new ValidationError(
                'Email already exists',
                ErrorCodes.EMAIL_ALREADY_EXISTS,
                error
              );
            } else {
              // NOTE: if not email, then it's some other unique constraint violation
              exceptions = new ValidationError(
                'Duplicate field value',
                ErrorCodes.VALIDATION_ERROR,
                error
              );
            }
          }
        } else if (error instanceof Prisma.PrismaClientValidationError) {
          // SECTION: Handle Prisma ClientValidation errors

          logger.error(error.message);
          exceptions = new ValidationError(
            'Validation Error',
            ErrorCodes.VALIDATION_ERROR,
            error
          );
        }
      }

      next(exceptions || new ApiError('Internal Server Error', 500, error));
    }
  };
};
