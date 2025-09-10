import { Router } from 'express';
import { protect } from '../middleware/protect.middleware.js';
import { asyncHandler } from '../utils/catch-async.js';
import {
  createSubCategory,
  getCategories,
  getSubCategoriesById,
} from '../controllers/category.controller.js';

const categoryRoute: Router = Router();

categoryRoute.post('/create', protect, asyncHandler(createSubCategory));
categoryRoute.get('/fetch', protect, asyncHandler(getCategories));
categoryRoute.get(
  '/subcategory/:id',
  protect,
  asyncHandler(getSubCategoriesById)
);

export default categoryRoute;
