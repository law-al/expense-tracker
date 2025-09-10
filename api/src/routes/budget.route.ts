import { Router } from 'express';
import { protect } from '../middleware/protect.middleware.js';
import { asyncHandler } from '../utils/catch-async.js';
import { createBudget } from '../controllers/budget.controller.js';

const budgetRoute: Router = Router();

budgetRoute.post('/create', protect, asyncHandler(createBudget));

export default budgetRoute;
