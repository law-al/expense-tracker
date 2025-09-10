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

// SECTION: Create budget
export const createBudget = async (req: Request, res: Response) => {
  if (!req.user) return;

  try {
    CreateBudgetSchema.parse(req.body);
  } catch (error) {
    throw error;
  }

  // STEP: check the period and assign startDate and endDate accordingly
  let startDate: Date;
  let endDate: Date;
  const currentDate = new Date();

  if (req.body.period === 'daily') {
    startDate = startOfDay(currentDate);
    endDate = endOfDay(currentDate);
  } else if (req.body.period === 'weekly') {
    startDate = startOfWeek(currentDate);
    endDate = endOfWeek(currentDate);
  } else if (req.body.period === 'monthly') {
    startDate = startOfMonth(currentDate);
    endDate = endOfMonth(currentDate);
  } else if (req.body.period === 'yearly') {
    startDate = startOfYear(currentDate);
    endDate = endOfYear(currentDate);
  } else {
    throw new BadRequestError('Invalid period specified');
  }

  // NOTE: Ensure that a budget for the same category and period does not already exist
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
