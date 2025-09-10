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

const accountsRoute: Router = Router();

accountsRoute.get('/fetch', protect, asyncHandler(getAccounts));
accountsRoute.post('/create', protect, asyncHandler(createAccount));
accountsRoute.patch('/:id', protect, asyncHandler(updateAccount));
accountsRoute.get('/total_balance', protect, asyncHandler(getTotalBalance));
accountsRoute.get('/types', asyncHandler(getAccountTypes));

export default accountsRoute;
