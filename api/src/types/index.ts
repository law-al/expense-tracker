import type { Prisma } from '@prisma/client';

export type { User, Account, AccountType } from '@prisma/client';

export type AccountWithDetails = Prisma.AccountGetPayload<{
  select: {
    id: true;
    name: true;
    currency: true;
    currentBalance: true;
    accountType: {
      select: {
        name: true;
        icon: true;
        color: true;
      };
    };
    transactions: {
      select: {
        id: true;
        amount: true;
        transactionType: { select: { name: true } };
        date: true;
      };
    };
  };
}>;

export type TransactionWithDetails = Prisma.TransactionGetPayload<{
  select: {
    date: true;
    description: true;
    amount: true;
    account: {
      select: {
        name: true;
        currency: true;
      };
    };
    transactionType: {
      select: {
        name: true;
      };
    };
  };
}>;

export type CategoryExpenseSummary = {
  categoryId: number | null;
  categoryName?: string | null;
  categoryColor?: string | null;
  totalAmount: number | null;
};

export type Category = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    icon: true;
    transactionTypeId: true;
    color: true;
    parentId: true;
    userId: true;
  };
}>;

export type Transaction = Prisma.TransactionGetPayload<{
  select: {
    id: true;
    date: true;
    description: true;
    amount: true;
    accountId: true;
    categoryId: true;
    transactionTypeId: true;
    userId: true;
    createdAt: true;
    updatedAt: true;
    account: {
      select: {
        id: true;
        name: true;
        currency: true;
        currentBalance: true;
        accountTypeId: true;
        accountType: {
          select: { name: true };
        };
        userId: true;
        createdAt: true;
        updatedAt: true;
      };
    };
    category: {
      select: {
        id: true;
        name: true;
        icon: true;
        transactionTypeId: true;
        color: true;
        parentId: true;
        userId: true;
        createdAt: true;
        updatedAt: true;
      };
    };
    transactionType: {
      select: {
        id: true;
        name: true;
        createdAt: true;
        updatedAt: true;
        userId: true;
      };
    };
  };
}>;
