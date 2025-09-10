import type { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../exceptions/not-found.js';
import { prismaClient } from '../utils/prisma-client.js';
import type { Account, Category, TransactionType } from '@prisma/client';
import { BadRequestError } from '../exceptions/bad-request.js';
import { HttpStatus } from '../utils/http-status.js';
import {
  CreateTransactionSchema,
  CreateTransferTransactionSchema,
} from '../schema/transactions.schema.js';
import { UnAuthorizedError } from '../exceptions/unauthorized.js';

//SECTION: Create transaction
export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //STEP: Validate the request body
  try {
    CreateTransactionSchema.parse(req.body);
  } catch (error) {
    throw error;
  }

  //STEP: check if amount is present
  if (!req.body.amount) {
    throw new BadRequestError('Please provide an amount');
  }

  //STEP: Find transaction type
  let transactionType: TransactionType;
  try {
    transactionType = await prismaClient.transactionType.findFirstOrThrow({
      where: {
        id: +req.body.transactionTypeId,
      },
    });
  } catch (error) {
    throw new NotFoundError('Transaction type not found');
  }

  //STEP: Find user account and make sure it belongs to the user
  let account: Account;
  try {
    account = await prismaClient.account.findFirstOrThrow({
      where: {
        id: +req.body.accountId,
      },
    });

    if (account.userId !== req.user?.id) {
      return next(new NotFoundError('Account not for this user'));
    }
  } catch (error) {
    throw new NotFoundError('Account not found');
  }

  //STEP: Check if category exists
  let category: Category;
  try {
    category = await prismaClient.category.findFirstOrThrow({
      where: {
        id: +req.body.categoryId,
      },
    });
  } catch (error) {
    throw new NotFoundError('Category not found');
  }

  //STEP: Check the trasaction type and update the account balance accordingly
  let newBalance: number;

  if (transactionType.name.toLowerCase() === 'income') {
    newBalance = 0 + Number(req.body.amount);
  } else if (transactionType.name.toLowerCase() === 'expense') {
    newBalance = 0 - Number(req.body.amount);
  }

  // FIXME: Work on adding subcategory

  //STEP: Create transaction and update account balance in a single transaction
  await prismaClient.$transaction(async (tx) => {
    if (!req.user) return;
    await tx.transaction.create({
      data: {
        userId: +req.user?.id,
        accountId: account.id,
        categoryId: category.id,
        amount: +req.body.amount,
        transactionTypeId: transactionType.id,
        description: req.body.description,
        date: new Date(req.body.date) || new Date(),
      },
    });

    await tx.account.update({
      where: {
        id: account.id,
        userId: +req.user?.id,
      },
      data: {
        currentBalance: {
          increment: newBalance,
        },
      },
    });
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Transaction created successfully',
  });
};

//SECTION: Create transfer transaction
export const createTransferTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //NOTE: if trasaction type is transfer then we need to update two accounts

  //STEP: Validate the request body
  try {
    CreateTransferTransactionSchema.parse(req.body);
  } catch (error) {
    throw error;
  }

  //STEP: Check if amount is present
  if (!req.body.amount) {
    throw new BadRequestError('Please provide an amount');
  }

  //STEP: Find user accounts and make sure they belong to the user and are not the same account
  let transferFromAccount: Account;
  let transferToAccount: Account;

  try {
    transferFromAccount = await prismaClient.account.findFirstOrThrow({
      where: {
        id: +req.body.transferFromAccountId,
      },
    });

    transferToAccount = await prismaClient.account.findFirstOrThrow({
      where: {
        id: +req.body.transferToAccountId,
      },
    });

    if (
      transferFromAccount.userId !== req.user?.id ||
      transferToAccount.userId !== req.user?.id
    ) {
      return next(new NotFoundError('One or both account not for this user'));
    }

    if (transferFromAccount.id === transferToAccount.id) {
      return next(new BadRequestError('Cannot transfer to the same account'));
    }
  } catch (error) {
    throw new NotFoundError('Account not found');
  }

  //STEP: if the transfer from account is valid, check if sufficient balance
  if (
    transferFromAccount.currentBalance &&
    transferFromAccount.currentBalance < +req.body.amount
  ) {
    return next(new BadRequestError('Insufficient balance'));
  }

  //STEP: Create transfer transaction and update both account balances in a single transaction
  await prismaClient.$transaction(async (tx) => {
    if (!req.user) {
      return next(new UnAuthorizedError('User not authenticated'));
    }
    const transactionData = [
      {
        userId: req.user.id,
        accountId: transferFromAccount.id,
        amount: +req.body.amount,
        transactionTypeId: 3,
        description: req.body.description,
        date: req.body.date ? new Date(req.body.date) : new Date(),
      },
      {
        userId: req.user.id,
        accountId: transferToAccount.id,
        amount: +req.body.amount,
        transactionTypeId: 4,
        description: req.body.description,
        date: req.body.date ? new Date(req.body.date) : new Date(),
      },
    ];

    await tx.transaction.createMany({
      data: transactionData,
    });

    await tx.account.update({
      where: {
        id: transferFromAccount.id,
        userId: req.user.id,
      },
      data: {
        currentBalance: {
          decrement: Number(req.body.amount),
        },
      },
    });

    await tx.account.update({
      where: {
        id: transferToAccount.id,
        userId: req.user.id,
      },
      data: {
        currentBalance: {
          increment: Number(req.body.amount),
        },
      },
    });
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Transfer transaction created successfully',
  });
};

// SECTION: Get all user expenses

export const getUserExpensesAggregrate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return;
  const aggregateExpenses = await prismaClient.transaction.groupBy({
    by: ['categoryId'],
    where: {
      userId: req.user?.id,
      transactionTypeId: 1,
    },
    _sum: {
      amount: true,
    },
  });

  //REVIEW:
  interface AggregrateData {
    categoryId: number | null;
    categoryName?: string | null;
    categoryColor?: string | null;
    totalAmount: number | null;
  }
  let aggregrateData: AggregrateData[] = [];
  if (aggregateExpenses.length > 0) {
    //STEP: find the category names for each categoryId
    for (const expense of aggregateExpenses) {
      if (!expense.categoryId) continue;
      const category = await prismaClient.category.findUnique({
        where: {
          id: +expense.categoryId,
        },
        select: {
          name: true,
          color: true,
        },
      });
      aggregrateData.push({
        categoryId: expense.categoryId,
        categoryName: category?.name || 'Uncategorized',
        categoryColor: category?.color || '#000000',
        totalAmount: expense._sum.amount,
      });
    }
  }

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'User expenses fetched successfully',
    data: aggregrateData,
  });
};
