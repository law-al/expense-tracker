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
import { format, startOfYear, endOfYear } from 'date-fns';
import type { Transaction } from '../types/index.js';

interface AggregrateData {
  categoryId: number | null;
  categoryName?: string | null;
  categoryColor?: string | null;
  totalAmount: number | null;
}

interface TransactionHistory {
  date: string;
  transactions: (Pick<Transaction, 'date' | 'description' | 'amount'> & {
    transactionType: Pick<Transaction['transactionType'], 'id'>;
    account: Pick<Transaction['account'], 'accountType'>;
    category: Pick<Transaction['category'], 'name' | 'color' | 'icon'>;
  })[];
}

const formatDate = (date: Date) => {
  const dateToFormat = new Date(date);
  return format(dateToFormat, 'dd MMMM yyyy');
};

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
  } catch {
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

    if (transactionType.name.toLowerCase() === 'expense') {
      if (account.currentBalance && account.currentBalance < +req.body.amount) {
        return next(new BadRequestError('Insufficient balance'));
      }
    }
  } catch  {
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
  } catch  {
    throw new NotFoundError('Category not found');
  }

  //STEP: Check the trasaction type and update the account balance accordingly
  let newBalance: number;

  if (transactionType.id === 2) {
    newBalance = 0 + Number(req.body.amount);
  } else if (transactionType.id === 1) {
    newBalance = 0 - Number(req.body.amount);
  }

  // STEP: Work on adding subcategory

  //STEP: Create transaction and update account balance in a single transaction
  await prismaClient.$transaction(
    async (tx) => {
      if (!req.user) return;
      await tx.transaction.create({
        data: {
          userId: +req.user?.id,
          accountId: account.id,
          categoryId: category.id,
          amount: +req.body.amount,
          transactionTypeId: transactionType.id,
          description: req.body.description,
          date: new Date(),
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
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    }
  );

  res.status(HttpStatus.CREATED).json({
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
  } catch {
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
  await prismaClient.$transaction(
    async (tx) => {
      if (!req.user) {
        return next(new UnAuthorizedError('User not authenticated'));
      }
      const transactionData = [
        {
          userId: req.user.id,
          accountId: transferFromAccount.id,
          amount: +req.body.amount,
          transactionTypeId: 3,
          categoryId: 48,
          description: req.body.description,
          date: req.body.date ? new Date(req.body.date) : new Date(),
        },
        {
          userId: req.user.id,
          accountId: transferToAccount.id,
          amount: +req.body.amount,
          transactionTypeId: 4,
          categoryId: 49,
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
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    }
  );

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Transfer transaction created successfully',
  });
};

// SECTION: Get all user expenses

export const getUserExpensesAggregrate = async (
  req: Request,
  res: Response,

) => {
  if (!req.user) return;

  const aggregateExpenses = await prismaClient.transaction.groupBy({
    by: ['categoryId'],
    where: {
      userId: req.user?.id,
      transactionTypeId: 1, // Expenses
    },
    _sum: {
      amount: true,
    },
  });

  // result looks like this
  // [
  //   { categoryId: 1, _sum: { amount: 500 } },
  //   { categoryId: 2, _sum: { amount: 300 } },
  // ]

  //REVIEW:

  const aggregrateData: AggregrateData[] = [];
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

// SECTION: Get recent transactions for the logged in user

export const getRecentTransactions = async (
  req: Request,
  res: Response,

) => {
  if (!req.user) return;

  const recentTransactions = await prismaClient.transaction.findMany({
    where: {
      userId: +req.user?.id,
    },
    select: {
      date: true,
      description: true,
      amount: true,
      account: {
        select: {
          name: true,
          currency: true,
        },
      },
      transactionType: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
    take: 3,
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Recent transactions fetched successfully',
    data: recentTransactions,
  });
};

// SECTION: Get transaction history for the logged in user

export const getTransactionHistory = async (
  req: Request,
  res: Response,
) => {
  if (!req.user) return;
  const period = req.query?.period || 2025;

  const year = new Date(+period, 0, 1);

  const startDate = startOfYear(+year);
  const endDate = endOfYear(+year);

  const transaction = await prismaClient.transaction.findMany({
    where: {
      userId: +req.user?.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      date: true,
      description: true,
      amount: true,
      transactionType: {
        select: { id: true },
      },
      account: {
        select: {
          accountType: {
            select: { name: true },
          },
        },
      },
      category: {
        select: {
          name: true,
          color: true,
          icon: true,
        },
      },
    },
  });

  const formattedTransaction = transaction.reduce((acc, tx) => {
    const formattedDate: string = formatDate(tx.date);
    const index = acc.findIndex((obj) => obj.date === formattedDate);

    if (index < 0) {
      const newObj: TransactionHistory = {
        date: formattedDate,
        transactions: [tx],
      };
      acc.push(newObj);
    } else {
      const existingObj = acc[index];
      if (existingObj) {
        existingObj.transactions.push(tx);
      }
    }

    return acc;
  }, [] as TransactionHistory[]);

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Transaction history fetched successfully',
    data: formattedTransaction,
  });
};
