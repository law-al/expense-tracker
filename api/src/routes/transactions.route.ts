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

const transactionsRoute: Router = Router();

transactionsRoute.post('/create', protect, asyncHandler(createTransaction));
transactionsRoute.post(
  '/transfer',
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
