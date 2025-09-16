import type { Request, Response } from 'express';
import { CreateBudgetSchema } from '../schema/budget.schema.js';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { BadRequestError } from '../exceptions/bad-request.js';
import { prismaClient } from '../utils/prisma-client.js';
import { HttpStatus } from '../utils/http-status.js';

const getPeriod = (period: string): { startDate: Date; endDate: Date } => {
  let startDate: Date;
  let endDate: Date;
  const currentDate = new Date();

  if (period === 'daily') {
    startDate = startOfDay(currentDate);
    endDate = endOfDay(currentDate);
  } else if (period === 'weekly') {
    startDate = startOfWeek(currentDate);
    endDate = endOfWeek(currentDate);
  } else if (period === 'monthly') {
    startDate = startOfMonth(currentDate);
    endDate = endOfMonth(currentDate);
  } else if (period === 'yearly') {
    startDate = startOfYear(currentDate);
    endDate = endOfYear(currentDate);
  } else {
    throw new BadRequestError('Invalid period specified');
  }

  return { startDate, endDate };
};

const getPercentage = (expense: number, budget: number): number => {
  let percentage: number = 0;
  if (expense && budget) {
    percentage = Math.round((expense / budget) * 100);
  }

  return percentage;
};

// SECTION: Create budget
export const createBudget = async (req: Request, res: Response) => {
  if (!req.user) return;

  try {
    CreateBudgetSchema.parse(req.body);
  } catch (error) {
    throw error;
  }

  // STEP: check the period and assign startDate and endDate accordingly
  const { startDate, endDate } = getPeriod(req.body.period.toLowerCase());

  // NOTE: Ensure that a budget for the same category and period does not already exist
  const existingBudget = await prismaClient.budget.findFirst({
    where: {
      userId: +req.user?.id,
      categoryId: req.body.categoryId,
      period: req.body.period.toUpperCase(),
      startDate,
      endDate,
    },
  });

  if (existingBudget) {
    // STEP: If a budget already exists for the same category and period, check if the previous amount less than the new amount and update it
    if (existingBudget.amount < req.body.amount) {
      await prismaClient.budget.update({
        where: {
          id: existingBudget.id,
        },
        data: {
          amount: req.body.amount,
        },
      });
    } else {
      throw new BadRequestError(
        'A budget for this category and period already exists with an equal or higher amount'
      );
    }
  }

  await prismaClient.budget.create({
    data: {
      userId: +req.user?.id,
      categoryId: req.body.categoryId,
      name: req.body.name,
      amount: req.body.amount,
      period: req.body.period.toUpperCase(),
      startDate,
      endDate,
    },
  });

  res.status(HttpStatus.CREATED).json({
    success: true,
    message: 'Budget created successfully',
  });
};

// SECTION: Get all budgets for the current user
export const getBudgets = async (req: Request, res: Response) => {
  if (!req.user) return;

  const period = req.query.period as string | undefined;
  const { startDate, endDate } = getPeriod(period || 'monthly');

  const budgets = await prismaClient.budget.findMany({
    where: {
      userId: +req.user?.id,
      startDate,
      endDate,
    },
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Budgets fetched successfully',
    data: budgets,
  });
};

// SECTION: Get all user budgets with expenses for the current period

export const getTotalBudgetsAndExpenses = async (
  req: Request,
  res: Response
) => {
  if (!req.user) return;
  const period = req.query.period as string | undefined;
  const { startDate, endDate } = getPeriod(period || 'monthly');

  const totalBudgets = await prismaClient.budget.aggregate({
    _sum: { amount: true },

    where: {
      userId: +req.user?.id,
      startDate,
      endDate,
    },
  });

  const totalExpenses = await prismaClient.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId: +req.user?.id,
      transactionTypeId: 1,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Total budgets fetched successfully',
    data: {
      totalBudgets: totalBudgets._sum.amount || 0,
      totalExpenses:
        totalBudgets._sum?.amount || 0 > 0 ? totalExpenses._sum.amount : 0,
      percentage: getPercentage(
        totalExpenses._sum.amount || 0,
        totalBudgets._sum.amount || 0
      ),
    },
  });
};

export const getTotalBudgetsAndExpenseByCategory = async (
  req: Request,
  res: Response
) => {
  if (!req.user) return;

  // STEP: Get the period from query params, default to monthly
  const period = req.query.period as string | undefined;
  const { startDate, endDate } = getPeriod(period || 'monthly');

  // STEP: Fetch total budgets by category for the current user and period
  const totalBudgetsByCategory = await prismaClient.budget.groupBy({
    by: ['categoryId'],
    where: {
      userId: +req.user?.id,
      amount: { gt: 0 },
      startDate,
      endDate,
    },
    _sum: { amount: true },
  });

  // STEP: If no budgets found, return early with an empty array
  if (totalBudgetsByCategory.length === 0) {
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'No budgets found for the specified period',
      data: [],
    });
  }

  // STEP: Extract categoryIds from the budgets to fetch corresponding expenses
  const categoryId = totalBudgetsByCategory.map((budget) => {
    if (budget.categoryId) return budget.categoryId;
    return 0;
  });

  // STEP: Fetch total expenses by category for the current user and period
  const totalExpensesByCategory = await prismaClient.transaction.groupBy({
    by: ['categoryId'],
    where: {
      userId: +req.user?.id,
      transactionTypeId: 1,
      categoryId: { in: categoryId },
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: { amount: true },
  });

  // STEP: Enrich expenses with category details (name, color, icon)
  const totalExpensesByCategoryWithDetails = await Promise.all(
    totalExpensesByCategory.map(async (expense) => {
      if (!expense.categoryId) return null;
      const category = await prismaClient.category.findUnique({
        where: { id: expense.categoryId },
        select: { id: true, name: true, color: true, icon: true },
      });

      return {
        ...expense,
        name: category?.name,
        color: category?.color,
        icon: category?.icon,
      };
    })
  );

  // STEP: Merge budgets and expenses by categoryId
  let mergedData: {
    categoryId: number;
    category: {
      name: string | undefined;
      color: string | undefined | null;
      icon: string | undefined | null;
    };
    totalBudget: number;
    totalExpense: number;
    percetage: number;
  }[] = [];
  if (totalExpensesByCategoryWithDetails.length > 0) {
    for (const budget of totalBudgetsByCategory) {
      if (!budget.categoryId) continue;

      const expense = totalExpensesByCategoryWithDetails.find(
        (expense) => expense?.categoryId === budget.categoryId
      );

      if (expense) {
        mergedData.push({
          categoryId: budget.categoryId,
          category: {
            name: expense?.name,
            color: expense?.color,
            icon: expense?.icon,
          },
          totalBudget: budget._sum.amount || 0,
          totalExpense: expense._sum.amount || 0,
          percetage: getPercentage(
            expense._sum.amount || 0,
            budget._sum.amount || 0
          ),
        });
      }
    }
  }

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Total budget fetched by category',
    data: mergedData,
  });
};
