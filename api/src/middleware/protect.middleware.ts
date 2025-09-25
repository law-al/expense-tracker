import type { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../exceptions/bad-request.js';
import { UnAuthorizedError } from '../exceptions/unauthorized.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../secret.js';
import type { User } from '@prisma/client';
import { prismaClient } from '../utils/prisma-client.js';
import { NotFoundError } from '../exceptions/not-found.js';
import logger from '../utils/logger.js';

interface IJwtPayload extends JwtPayload {
  id: number | string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization)
      throw new BadRequestError('Please provide an authorization header');

    const token = authorization.split(' ')[1];

    if (!token) throw new UnAuthorizedError('No token present');

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET!) as IJwtPayload;
    } catch (error) {
      logger.error(error);
      throw new UnAuthorizedError('Invalid token, Please login again');
    }

    if (!decoded.id) return;

    let user: User;
    try {
      user = await prismaClient.user.findFirstOrThrow({
        where: {
          id: +decoded.id,
        },
      });
    } catch {
      throw new NotFoundError('User not found, Please login again');
    }

    if (user.passwordChangedAt && decoded.iat) {
      const passwordChanged =
        decoded.iat < +new Date(user.passwordChangedAt).getTime() / 1000;
      if (passwordChanged)
        throw new UnAuthorizedError(
          'Password has been changed recently, Please login again'
        );
    }

    req.user = user;
    next();
  } catch (error) {
    throw error;
  }
};
