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

const authRoute = Router();

authRoute.post('/register', asyncHandler(register));
authRoute.post('/login', asyncHandler(login));
authRoute.post('/verify', asyncHandler(verifyEmail));
authRoute.post('/resend-otp', asyncHandler(resendOtp));
authRoute.post('/forgot-password', asyncHandler(forgotPassword));
authRoute.patch('/reset-password/:token', asyncHandler(resetPassword));
authRoute.get('/refresh-token', asyncHandler(getAccessToken));

export default authRoute;
