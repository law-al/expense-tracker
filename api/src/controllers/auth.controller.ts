import type { Request, Response } from 'express';
import { LoginSchema, RegisterSchema } from '../schema/auth.schema.js';
import { prismaClient } from '../utils/prisma-client.js';
import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import type { User } from '@prisma/client';
import { NotFoundError } from '../exceptions/not-found.js';
import { BadRequestError } from '../exceptions/bad-request.js';
import { JWT_SECRET, NODE_ENV } from '../../secret.js';

interface IJwtPayload extends JwtPayload {
  id: number | string;
}

export const register = async (req: Request, res: Response) => {
  try {
    RegisterSchema.parse(req.body);
    await prismaClient.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashSync(req.body.password, 12),
      },
    });

    res.status(200).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (req: Request, res: Response) => {
  LoginSchema.parse(req.body);

  const { username, password } = req.body;
  let user: User;

  try {
    user = await prismaClient.user.findFirstOrThrow({
      where: {
        username,
      },
    });
  } catch (error) {
    throw new NotFoundError('User not found');
  }

  const isMatch = compareSync(password, user.password);

  if (!isMatch) throw new BadRequestError('Invalid Credentials');

  const accessToken = jwt.sign({ id: user.id }, JWT_SECRET!, {
    expiresIn: '5m',
  });

  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET!, {
    expiresIn: '7d',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'User login success',
    data: {
      accessToken,
    },
  });
};

export const getAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    throw new NotFoundError('No refresh token present, Please login again');

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, JWT_SECRET!) as IJwtPayload;
  } catch (error) {
    throw error; // handle error in the  catch-async
  }

  if (!decoded.id)
    throw new NotFoundError('No refresh token present, Please login again');

  let user: User;
  try {
    user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +decoded.id,
      },
    });
  } catch (error) {
    throw new NotFoundError('User not found, Please login again');
  }

  if (user.passwordChangedAt && decoded.iat) {
    const passwordChanged =
      decoded.iat < +new Date(user.passwordChangedAt).getTime() / 1000;
    if (passwordChanged)
      throw new BadRequestError(
        'Password has been changed recently, Please login again'
      );
  }

  const accessToken = jwt.sign({ id: user.id }, JWT_SECRET!, {
    expiresIn: '5m',
  });

  res.status(200).json({
    success: true,
    data: {
      accessToken,
    },
  });
};
