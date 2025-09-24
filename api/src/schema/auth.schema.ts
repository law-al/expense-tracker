import { z } from 'zod';
import { createErrorMap } from 'zod-validation-error';

z.config({
  customError: createErrorMap(),
});

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be a minimum of 3-30 characters')
    .max(30, 'Username must be a minimum of 3-30 characters')
    .regex(
      /^[a-z0-9_]+$/i,
      'Username can only contain letters, numbers, and underscores'
    ),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 8 characters long'),
});

export const VerifyOTPSchema = z.object({
  otp: z
    .number()
    .min(100000, 'OTP must be 6 digits')
    .max(999999, 'OTP must be 6 digits'),
});

export const LoginSchema = z.object({
  username: z.string().min(1, 'Please enter a username'),
  password: z.string().min(1, 'Please provide a password'),
});
