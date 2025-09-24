import type { Request, Response } from 'express';
import {
  LoginSchema,
  RegisterSchema,
  VerifyOTPSchema,
} from '../schema/index.js';
import { prismaClient } from '../utils/prisma-client.js';
import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import type { User } from '@prisma/client';
import { NotFoundError } from '../exceptions/not-found.js';
import { BadRequestError } from '../exceptions/bad-request.js';
import { JWT_SECRET, NODE_ENV } from '../../secret.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/send-emal.js';
import { da } from 'zod/locales';

interface IJwtPayload extends JwtPayload {
  id: number | string;
}

const generateOtp = () => {
  let otp;
  let otpHash;
  otp = crypto.randomInt(100000, 999999).toString();
  otpHash = crypto.createHash('sha256').update(otp).digest('hex');
  return { otp, otpHash };
};

const getTokens = (id: number | string, res: Response) => {
  const accessToken = jwt.sign({ id }, JWT_SECRET!, {
    expiresIn: '5m',
  });

  const refreshToken = jwt.sign({ id }, JWT_SECRET!, {
    expiresIn: '7d',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

// SECTION: Register user

export const register = async (req: Request, res: Response) => {
  try {
    try {
      RegisterSchema.parse(req.body);
    } catch (error) {
      throw error;
    }

    const { otp, otpHash } = generateOtp();
    let token: string | null = null;

    await prismaClient.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: req.body.username,
          email: req.body.email,
          otp: otpHash,
          otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
          isVerified: false,
          password: hashSync(req.body.password, 12),
        },
      });

      token = jwt.sign({ id: user.id }, JWT_SECRET!);

      if (user) {
        try {
          await sendEmail(
            req.body.email,
            'Verify your email',
            `Your OTP is ${otp}. It will expire in 10 minutes.`
          );
        } catch (error) {
          throw error;
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully, Please verify your email',
      data: {
        accessToken: token || null,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// SECTION: Verify email

export const verifyEmail = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  const { otp } = req.body;
  try {
    VerifyOTPSchema.parse({ otp: +otp });
  } catch (error) {
    throw error;
  }

  if (!token || typeof token !== 'string')
    throw new BadRequestError('Invalid or missing token');

  let decoded: IJwtPayload;
  decoded = jwt.verify(token, JWT_SECRET!) as IJwtPayload;

  if (!decoded.id) throw new BadRequestError('Invalid token');

  const user = await prismaClient.user.findFirst({
    where: {
      id: +decoded.id,
    },
  });

  if (!user) throw new NotFoundError('User not found');

  if (user.isVerified) throw new BadRequestError('User already verified');

  const inputOtpHash = crypto.createHash('sha256').update(otp).digest('hex');

  if (user.otp !== inputOtpHash) throw new BadRequestError('Invalid OTP');

  if (user.otpExpiry && user.otpExpiry < new Date())
    throw new BadRequestError('OTP has expired');

  await prismaClient.user.update({
    where: { id: user.id },
    data: { isVerified: true, otp: null, otpExpiry: null },
  });

  const { accessToken } = getTokens(user.id, res);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully, you can now login',
    data: { accessToken },
  });
};

// SECTION: Resend OTP

export const resendOtp = async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token || typeof token !== 'string')
    throw new BadRequestError('Invalid or missing token');

  let decoded: IJwtPayload;
  decoded = jwt.verify(token, JWT_SECRET!) as IJwtPayload;

  if (!decoded.id) throw new BadRequestError('Invalid token');

  const user = await prismaClient.user.findFirst({
    where: {
      id: +decoded.id,
    },
  });

  if (!user) throw new NotFoundError('User not found');

  if (user.isVerified) throw new BadRequestError('User already verified');

  const { otp, otpHash } = generateOtp();

  await prismaClient.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { otp: otpHash, otpExpiry: new Date(Date.now() + 10 * 60 * 1000) },
    });

    try {
      await sendEmail(
        user.email,
        'Verify your email',
        `Your OTP is ${otp}. It will expire in 10 minutes.`
      );
    } catch (error) {
      throw new BadRequestError('Email not sent, Please try again later');
    }
  });

  res.status(200).json({
    success: true,
    message: 'OTP sent to your email successfully',
  });
};

// SECTION: Login user

export const login = async (req: Request, res: Response) => {
  try {
    LoginSchema.parse(req.body);
  } catch (error) {
    throw error;
  }

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

  if (!user.isVerified)
    throw new BadRequestError('Please verify your email to login');

  const isMatch = compareSync(password, user.password);

  if (!isMatch) throw new BadRequestError('Invalid Credentials');

  const { accessToken } = getTokens(user.id, res);

  res.status(200).json({
    success: true,
    message: 'User login success',
    data: {
      accessToken,
    },
  });
};

// SECTION: Forgot password

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prismaClient.user.findFirstOrThrow({
    where: {
      email,
    },
  });

  if (!user) throw new NotFoundError('User not found');

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  await prismaClient.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
  });

  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  try {
    await sendEmail(
      user.email,
      'Reset your password',
      `Click the link to reset your password: ${resetUrl}. This link will expire in 10 minutes.`
    );
  } catch (error) {
    throw error;
  }

  res.status(200).json({
    success: true,
    message: 'Password reset link sent to your email',
  });
};

// SECTION: Reset password

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token || typeof token !== 'string')
    throw new BadRequestError('Invalid or missing token');

  const resetTokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await prismaClient.user.findFirst({
    where: {
      resetToken: resetTokenHash,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) throw new BadRequestError('Invalid or expired token');

  if (!newPassword || newPassword.length < 6)
    throw new BadRequestError('Password must be at least 6 characters long');

  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      password: hashSync(newPassword, 12),
      resetToken: null,
      resetTokenExpiry: null,
      passwordChangedAt: new Date(),
    },
  });

  res.status(200).json({
    success: true,
    message: 'Password reset successfully, you can now login with new password',
  });
};

// SECTION: Get new access token using refresh token

export const getAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    throw new NotFoundError('No refresh token present, Please login again');

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, JWT_SECRET!) as IJwtPayload;
  } catch (error) {
    throw error;
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
