import { Router } from 'express';
import { protect } from '../middleware/protect.middleware.js';
import { asyncHandler } from '../utils/catch-async.js';
import {
  createSubCategory,
  getExpenseCategories,
  getIncomeCategories,
  fetchSubCategoriesById,
} from '../controllers/category.controller.js';

const categoryRoute: Router = Router();

categoryRoute.post('/create', protect, asyncHandler(createSubCategory));
categoryRoute.get(
  '/fetch-expense',
  protect,
  asyncHandler(getExpenseCategories)
);
categoryRoute.get('/fetch-income', protect, asyncHandler(getIncomeCategories));
categoryRoute.get(
  '/sub-category/:id',
  protect,
  asyncHandler(fetchSubCategoriesById)
);

export default categoryRoute;
