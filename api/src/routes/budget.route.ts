import { Router } from 'express';
import { protect } from '../middleware/protect.middleware.js';
import { asyncHandler } from '../utils/catch-async.js';
import {
  createBudget,
  getBudgets,
  getTotalBudgetsAndExpenseByCategory,
  getTotalBudgetsAndExpenses,
} from '../controllers/budget.controller.js';

const budgetRoute: Router = Router();

budgetRoute.post('/create', protect, asyncHandler(createBudget));
budgetRoute.get('/fetch', protect, asyncHandler(getBudgets));
budgetRoute.get(
  '/total_budget',
  protect,
  asyncHandler(getTotalBudgetsAndExpenses)
);
budgetRoute.get(
  '/total_budget_by_category',
  protect,
  asyncHandler(getTotalBudgetsAndExpenseByCategory)
);

export default budgetRoute;
