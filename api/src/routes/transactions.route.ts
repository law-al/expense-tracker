import { Router } from 'express';
import { protect } from '../middleware/protect.middleware.js';
import { asyncHandler } from '../utils/catch-async.js';
import {
  createTransaction,
  createTransferTransaction,
  getRecentTransactions,
  getTransactionHistory,
  getUserExpensesAggregrate,
} from '../controllers/transactions.controller.js';
import { rateLimit } from '../middleware/limiter.js';

const transactionsRoute: Router = Router();

transactionsRoute.post(
  '/create',
  rateLimit(60 * 1000, 10),
  protect,
  asyncHandler(createTransaction)
);
transactionsRoute.post(
  '/transfer',
  rateLimit(60 * 1000, 5),
  protect,
  asyncHandler(createTransferTransaction)
);
transactionsRoute.get(
  '/expenses-aggregrate',
  protect,
  asyncHandler(getUserExpensesAggregrate)
);
transactionsRoute.get('/recent', protect, asyncHandler(getRecentTransactions));
transactionsRoute.get('/history', protect, asyncHandler(getTransactionHistory));

export default transactionsRoute;
