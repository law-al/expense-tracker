import { Router } from 'express';
import {
  getAccessToken,
  login,
  register,
} from '../controllers/auth.controller.js';
import { asyncHandler } from '../utils/catch-async.js';

const authRoute = Router();

authRoute.post('/register', asyncHandler(register));
authRoute.post('/login', asyncHandler(login));
authRoute.get('/refresh_token', asyncHandler(getAccessToken));

export default authRoute;
