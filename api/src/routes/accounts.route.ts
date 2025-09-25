import { Router } from 'express';
import { protect } from '../middleware/protect.middleware.js';
import { asyncHandler } from '../utils/catch-async.js';
import {
  createAccount,
  getAccounts,
  getAccountTypes,
  getTotalBalance,
  updateAccount,
} from '../controllers/accounts.controller.js';
import { rateLimit } from '../middleware/limiter.js';

const accountsRoute: Router = Router();

accountsRoute.get('/fetch', protect, asyncHandler(getAccounts));
accountsRoute.post(
  '/create',
  rateLimit(60 * 1000, 3),
  protect,
  asyncHandler(createAccount)
);
accountsRoute.patch(
  '/:id',
  rateLimit(60 * 1000, 3),
  protect,
  asyncHandler(updateAccount)
);
accountsRoute.get('/total-balance', protect, asyncHandler(getTotalBalance));
accountsRoute.get('/types', asyncHandler(getAccountTypes));

export default accountsRoute;
