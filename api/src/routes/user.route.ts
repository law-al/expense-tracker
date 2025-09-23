import { Router } from 'express';
import { protect } from '../middleware/protect.middleware.js';
import { asyncHandler } from '../utils/catch-async.js';
import {
  changePassword,
  deleteMe,
  getMe,
  updateMe,
} from '../controllers/user.controller.js';

const userRoute = Router();

userRoute.get('/me', protect, asyncHandler(getMe));
userRoute.patch('/me', protect, asyncHandler(updateMe));
userRoute.delete('/me', protect, asyncHandler(deleteMe));
userRoute.patch('/change-password', protect, asyncHandler(changePassword));

export default userRoute;
