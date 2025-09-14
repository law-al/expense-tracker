import { Router } from 'express';
import { protect } from '../middleware/protect.middleware.js';
import { asyncHandler } from '../utils/catch-async.js';
import {
  createSubCategory,
  getExpenseCategories,
  getIncomeCategories,
  getSubCategoriesById,
} from '../controllers/category.controller.js';

const categoryRoute: Router = Router();

categoryRoute.post('/create', protect, asyncHandler(createSubCategory));
categoryRoute.get(
  '/fetch_expense',
  protect,
  asyncHandler(getExpenseCategories)
);
categoryRoute.get('/fetch_income', protect, asyncHandler(getIncomeCategories));
categoryRoute.get(
  '/subcategory/:id',
  protect,
  asyncHandler(getSubCategoriesById)
);

export default categoryRoute;
