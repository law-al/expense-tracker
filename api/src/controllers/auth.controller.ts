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
import { JWT_SECRET, NODE_ENV } from '../secret.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/send-email.js';

interface IJwtPayload extends JwtPayload {
  id: number | string;
  iat?: number;
}

const generateOtp = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
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
  RegisterSchema.parse(req.body);

  const { otp, otpHash } = generateOtp();
  let token: string | null = null;
  let createdUser;

  const existingUser = await prismaClient.user.findFirst({
    where: {
      OR: [{ username: req.body.username }, { email: req.body.email }],
    },
  });

  if (existingUser && existingUser.isVerified) {
    return res.status(400).json({
      success: false,
      message: 'User with this username or email already exists',
    });
  }

  if (existingUser && !existingUser.isVerified) {
    // Update unverified user
    createdUser = await prismaClient.user.update({
      where: { id: existingUser.id },
      data: {
        username: req.body.username,
        email: req.body.email,
        otp: otpHash,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
        password: hashSync(req.body.password, 12),
      },
    });

    token = jwt.sign({ id: createdUser.id }, JWT_SECRET!);
  } else {
    // Create new user
    createdUser = await prismaClient.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        otp: otpHash,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
        isVerified: false,
        password: hashSync(req.body.password, 12),
      },
    });

    token = jwt.sign({ id: createdUser.id }, JWT_SECRET!);
  }

  res.status(existingUser ? 200 : 201).json({
    success: true,
    message: existingUser
      ? 'User already registered but not verified, Please verify your email'
      : 'User registered successfully, Please verify your email',
    data: { accessToken: token },
  });

  sendEmail(
    req.body.email,
    'Verify your email',
    `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Email Verification</h2>
      <p>Thank you for registering! Please use the OTP below to verify your email address:</p>
      <h3 style="background: #f4f4f4; padding: 10px; display: inline-block;">${otp}</h3>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br />
      <p>Best regards,<br/>Expense Tracker Team</p>
    </div>`
  ).catch((err) => console.error('Email sending failed:', err));
};

// SECTION: Verify email

export const verifyEmail = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  const { otp } = req.body;

  VerifyOTPSchema.parse({ otp: +otp });

  if (!token || typeof token !== 'string')
    throw new BadRequestError('Invalid or missing token');

  const decoded = jwt.verify(token, JWT_SECRET!) as IJwtPayload;

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

  if (!token || typeof token !== 'string') {
    throw new BadRequestError('Invalid or missing token');
  }

  const decoded = jwt.verify(token, JWT_SECRET!) as IJwtPayload;
  if (!decoded.id) throw new BadRequestError('Invalid token');

  const user = await prismaClient.user.findFirst({
    where: { id: +decoded.id },
  });

  if (!user) throw new NotFoundError('User not found');
  if (user.isVerified) throw new BadRequestError('User already verified');

  const { otp, otpHash } = generateOtp();

  // Step 1: Update OTP (no transaction needed)
  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      otp: otpHash,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  // Step 2: Respond to client immediately
  res.status(200).json({
    success: true,
    message: 'OTP sent to your email successfully',
  });

  // Step 3: Send email asynchronously
  sendEmail(
    user.email,
    'Verify your email',
    `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Email Verification</h2>
      <p>Thank you for registering! Please use the OTP below to verify your email address:</p>
      <h3 style="background: #f4f4f4; padding: 10px; display: inline-block;">${otp}</h3>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br />
      <p>Best regards,<br/>Expense Tracker Team</p>
    </div>`
  ).catch((err) => console.error('Failed to send OTP email:', err));
};

// SECTION: Login user

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
  } catch {
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

  const user = await prismaClient.user.findFirst({
    where: { email },
  });

  if (!user) throw new NotFoundError('User not found');

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

  await prismaClient.$transaction(
    async (tx) => {
      // Step 1: Update DB inside transaction
      await tx.user.update({
        where: { id: user.id },
        data: {
          resetToken: resetTokenHash,
          resetTokenExpiry: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      // Step 2: Send email — if this fails, transaction will rollback
      try {
        await sendEmail(
          user.email,
          'Reset your password',
          `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>We received a request to reset your password. Click the link below to set a new password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 15px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in 10 minutes.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <br />
            <p>Best regards,<br/>Expense Tracker Team</p>
          </div>
          `
        );
      } catch {
        throw new BadRequestError(
          'Failed to send reset email. Please try again later'
        );
      }
    },
    {
      maxWait: 50000, // optional tuning
      timeout: 100000,
    }
  );

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

  const decoded = jwt.verify(refreshToken, JWT_SECRET!) as IJwtPayload;

  if (!decoded.id)
    throw new NotFoundError('No refresh token present, Please login again');

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
