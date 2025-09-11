import type { NextFunction, Request, Response } from 'express';
import { CreateAccountSchema } from '../schema/accounts.schema.js';
import type { Account, AccountType } from '@prisma/client';
import { prismaClient } from '../utils/prisma-client.js';
import { NotFoundError } from '../exceptions/not-found.js';
import { UnAuthorizedError } from '../exceptions/unauthorized.js';
import { HttpStatus } from '../utils/http-status.js';
import { success } from 'zod';
import type { AccountWithDetails } from '../types/index.js';

//SECTION: Create account

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return;

  //STEP: Validate request body
  try {
    CreateAccountSchema.parse(req.body);
  } catch (error) {
    throw error;
  }

  //STEP: Check if account type exists and belongs to the user (if createdBy is not null)
  // User can only use account types that are public (createdBy is null) or created by themselves
  let accountType: AccountType;
  try {
    accountType = await prismaClient.accountType.findFirstOrThrow({
      where: {
        id: +req.body.accountTypeId,
      },
    });

    if (
      accountType.createdBy !== null &&
      accountType.createdBy !== req.user?.id
    ) {
      return next(new NotFoundError('Account type not found'));
    }
  } catch (error) {
    throw new NotFoundError('Account type not found');
  }

  //STEP: Check if user already has an account
  const accountExist = await prismaClient.account.findFirst({
    where: {
      accountTypeId: accountType.id,
      userId: +req.user?.id,
    },
  });

  if (accountExist)
    throw new UnAuthorizedError('You already have an account of this type');

  //STEP: Create account
  await prismaClient.account.create({
    data: {
      userId: +req.user?.id,
      name: req.body.accountName.toLowerCase(),
      accountTypeId: accountType.id,
      currency: req.body.currrency || 'USD',
      openingBalance: req.body.openingBalance || 0,
      currentBalance: req.body.openingBalance || 0,
    },
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Account created successfully',
  });
};

//SECTION: Update account

export const updateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, openingBalance, accountTypeId } = req.body;
  const { id } = req.params;

  //REVIEW: Should we allow updating account by using params id only?
  if (!req.user) return;
  if (!id) throw new NotFoundError('Account ID is required');

  if (
    name === undefined &&
    openingBalance === undefined &&
    accountTypeId === undefined
  ) {
    throw new UnAuthorizedError('Please provide a field to update');
  }

  let account: Account;
  try {
    account = await prismaClient.account.findFirstOrThrow({
      where: { id: +id, userId: +req.user?.id },
    });
  } catch (error) {
    throw new NotFoundError('Account not found');
  }

  //STEP: If accountTypeId is provided, check if it exists and belongs to the user (if createdBy is not null)

  if (req.body.accountTypeId) {
    let accountType: AccountType;
    try {
      accountType = await prismaClient.accountType.findFirstOrThrow({
        where: {
          id: +req.body.accountTypeId,
        },
      });

      if (
        accountType.createdBy !== null &&
        accountType.createdBy !== req.user?.id
      ) {
        return next(new NotFoundError('Account type not found'));
      }
    } catch (error) {
      throw new NotFoundError('Account type not found');
    }
  }

  const updateData: Partial<Account> = {};
  const allowedKeys: (keyof Account)[] = [
    'name',
    'accountTypeId',
    'currency',
    'openingBalance',
    'currentBalance',
  ];

  allowedKeys.forEach((key) => {
    if (req.body[key] !== undefined) {
      (updateData as any)[key] = req.body[key];
    }
  });

  await prismaClient.account.update({
    where: {
      id: account.id,
    },
    data: updateData,
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Account updated successfully',
  });
};

//SECTION: Get all accounts for the logged in user

export const getAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return;
  const accounts: AccountWithDetails[] = await prismaClient.account.findMany({
    where: {
      userId: +req.user?.id,
    },
    select: {
      name: true,
      currency: true,
      currentBalance: true,
      accountType: {
        select: {
          name: true,
          icon: true,
          color: true,
        },
      },
      transactions: {
        select: {
          id: true,
          amount: true,
          transactionType: { select: { name: true } },
          date: true,
        },
      },
    },
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Accounts fetched successfully',
    data: {
      accounts,
      totalBalance: accounts.reduce(
        (acc, account) => acc + (account?.currentBalance || 0),
        0
      ),
    },
  });
};

//SECTION: Aggregate total balance of all accounts for the logged in user

export const getTotalBalance = async (req: Request, res: Response) => {
  if (!req.user) return;

  //STEP: Check if user has accounts
  const accounts = await prismaClient.account.findMany({
    where: {
      userId: +req.user?.id,
    },
  });

  const totalBalance = await prismaClient.account.aggregate({
    where: {
      userId: +req.user?.id,
    },
    _sum: {
      currentBalance: true,
    },
    _count: {
      _all: true,
    },
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Total balance fetched successfully',
    data: {
      totalBalance: totalBalance._sum.currentBalance ?? 0,
      accountCount: totalBalance._count._all ?? 0,
    },
  });
};

//SECTION: Create account type

export const createAccountType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return;
};

// SECTION: get all default account types

export const getAccountTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accountTypes = await prismaClient.accountType.findMany({
    where: {
      createdBy: null,
    },
  });

  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Account type fetched success',
    data: accountTypes,
  });
};
