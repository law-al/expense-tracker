import { Router } from 'express';
import { protect } from '../middleware/protect.middleware.js';
import { asyncHandler } from '../utils/catch-async.js';
import { changePassword } from '../controllers/user.controller.js';

const userRoute = Router();

userRoute.patch('/change-password', protect, asyncHandler(changePassword));

export default userRoute;
