import type { NextFunction, Request, Response } from 'express';
/* eslint-disable @typescript-eslint/no-explicit-any */
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      next(error);
    }
  };
};
