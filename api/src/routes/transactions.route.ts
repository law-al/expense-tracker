import { Router } from 'express';
import { protect } from '../middleware/protect.middleware.js';
import { asyncHandler } from '../utils/catch-async.js';
import {
  createTransaction,
  createTransferTransaction,
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
  '/expenses_aggregrate',
  protect,
  asyncHandler(getUserExpensesAggregrate)
);

export default transactionsRoute;
