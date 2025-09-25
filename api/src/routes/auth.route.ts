import { Router } from 'express';
import {
  forgotPassword,
  getAccessToken,
  login,
  register,
  resendOtp,
  resetPassword,
  verifyEmail,
} from '../controllers/auth.controller.js';
import { asyncHandler } from '../utils/catch-async.js';
import { rateLimit } from '../middleware/limiter.js';

const authRoute = Router();

authRoute.post(
  '/register',
  rateLimit(15 * 60 * 1000, 3),
  asyncHandler(register)
);
authRoute.post('/login', rateLimit(15 * 60 * 1000, 5), asyncHandler(login));
authRoute.post('/verify', asyncHandler(verifyEmail));
authRoute.get('/resend-otp', asyncHandler(resendOtp));
authRoute.post(
  '/forgot-password',
  rateLimit(15 * 60 * 1000, 3),
  asyncHandler(forgotPassword)
);
authRoute.patch('/reset-password/:token', asyncHandler(resetPassword));
authRoute.get('/refresh-token', asyncHandler(getAccessToken));

export default authRoute;
