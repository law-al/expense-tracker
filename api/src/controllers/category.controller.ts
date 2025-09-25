import type { NextFunction, Request, Response } from 'express';
import { CreateCategorySchema } from '../schema/category.schema.js';
import type { Category } from '@prisma/client';
import { prismaClient } from '../utils/prisma-client.js';
import { NotFoundError } from '../exceptions/not-found.js';
import { HttpStatus } from '../utils/http-status.js';

//SECTION: Create sub-category

export const createSubCategory = async (req: Request, res: Response) => {
  if (!req.user) return;
  //STEP: Validate request body
  try {
    CreateCategorySchema.parse(req.body);
  } catch (error) {
    throw error;
  }

  //STEP: Check if parent category is provided
  if (!req.body.parentId)
    throw new NotFoundError('Please provide a parent category id');

  let parentCategory: Category;

  //STEP: Check if parent category exists
  try {
    parentCategory = await prismaClient.category.findFirstOrThrow({
      where: {
        id: +req.body.parentId,
      },
    });
  } catch  {
    throw new NotFoundError('Parent category not found');
  }

  //STEP: Create sub-category
  const category = await prismaClient.category.create({
    data: {
      // userId: +req.user?.id,
      name: req.body.name,
      color: req.body.color || null,
      icon: req.body.icon || null,
      parentId: parentCategory.id,
    },
  });

  res.status(HttpStatus.CREATED).json({
    success: true,
    message: 'Sub-category created successfully',
    data: category,
  });
};

// SECTION: get expense categories including sub-categories and curent user subcategories
export const getExpenseCategories = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) return;

  // STEP: Fetch all categories including sub-categories and current user sub-categories
  const categories = await prismaClient.category.findMany({
    where: {
      parentId: null, // Only fetch parent categories
      transactionTypeId: 1, // 1 is for expense categories
    },
    select: {
      id: true,
      transactionTypeId: true,
      name: true,
      icon: true,
      color: true,
    },
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Expense Categories fetched successfully',
    data: categories,
  });
};

// SECTION: get income categories including sub-categories and curent user subcategories
export const getIncomeCategories = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) return;

  // STEP: Fetch all categories including sub-categories and current user sub-categories
  const categories = await prismaClient.category.findMany({
    where: {
      parentId: null, // Only fetch parent categories
      transactionTypeId: 2, // 1 is for expense categories
    },
    select: {
      id: true,
      transactionTypeId: true,
      name: true,
      icon: true,
      color: true,
    },
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Income Categories fetched successfully',
    data: categories,
  });
};

//SECTION: Get sub-categories by category id
export const fetchSubCategoriesById = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) return;
  const { id } = req.params;

  if (!id) throw new NotFoundError('Category id is required');

  // STEP: Fetch sub-categories by id
  const subcategories = await prismaClient.category.findMany({
    where: {
      OR: [
        { parentId: +id, userId: req.user?.id },
        { parentId: +id, userId: null },
      ],
    },
    select: {
      id: true,
      name: true,
      icon: true,
      color: true,
    },
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Sub-categories fetched successfully',
    data: subcategories,
  });
};
