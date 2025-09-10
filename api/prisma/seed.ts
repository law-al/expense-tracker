import { PrismaClient, Prisma } from '@prisma/client';
import logger from '../src/utils/logger.js';

const prisma = new PrismaClient();

const accountTypeData: Prisma.AccountTypeCreateInput[] = [
  { name: 'Cash', color: 'amber', icon: 'Wallet' },
  { name: 'Bank', color: 'blue', icon: 'Banknote' },
  { name: 'Credit Card', color: 'green', icon: 'CreditCard' },
];

const transactionTypeData: Prisma.TransactionTypeCreateInput[] = [
  { name: 'expense' },
  { name: 'income' },
  { name: 'transfer_from' },
  { name: 'transfer_to' },
];

const categoryData: Prisma.CategoryCreateInput[] = [
  { name: 'Food & Dining', icon: 'Utensils', color: 'red' },
  { name: 'Shopping', icon: 'ShoppingCart', color: 'blue' },
  { name: 'Utilities', icon: 'Bolt', color: 'yellow' },
  { name: 'Transportation', icon: 'Car', color: 'green' },
  { name: 'Health', icon: 'Heart', color: 'pink' },
  { name: 'Entertainment', icon: 'Film', color: 'purple' },
  { name: 'Travel', icon: 'Plane', color: 'teal' },
  { name: 'Education', icon: 'Book', color: 'indigo' },
];

async function main() {
  await prisma.accountType.createMany({
    data: accountTypeData,
    skipDuplicates: true,
  });
  await prisma.transactionType.createMany({
    data: transactionTypeData,
    skipDuplicates: true,
  });
  await prisma.category.createMany({
    data: categoryData,
    skipDuplicates: true,
  });

  logger.info('Seeded account types, transaction types, and categories');
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
