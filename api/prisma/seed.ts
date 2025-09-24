import { PrismaClient, Prisma } from '@prisma/client';
import logger from '../src/utils/logger.js';

const prisma = new PrismaClient();

const accountTypeData: Prisma.AccountTypeCreateInput[] = [
  {
    name: 'Cash',
    color: 'amber',
    icon: 'i-material-symbols-light-wallet-sharp',
  },
  { name: 'Bank', color: 'blue', icon: 'i-mdi-bank-outline' },
  {
    name: 'Credit Card',
    color: 'green',
    icon: 'i-material-symbols-light-credit-card-sharp',
  },
];

const categoryData: Prisma.CategoryCreateInput[] = [
  {
    name: 'Food & Dining',
    icon: 'i-mdi-utensils',
    color: 'red',
    transactionTypeId: 1,
  },
  {
    name: 'Shopping',
    icon: 'i-ion-cart-sharp',
    color: 'blue',
    transactionTypeId: 1,
  },
  {
    name: 'Utilities',
    icon: 'i-ph-gear-six-fill',
    color: 'yellow',
    transactionTypeId: 1,
  },
  {
    name: 'Transportation',
    icon: 'i-material-symbols-light-train',
    color: 'green',
    transactionTypeId: 1,
  },
  {
    name: 'Health',
    icon: 'i-material-symbols-home-health',
    color: 'pink',
    transactionTypeId: 1,
  },
  {
    name: 'Entertainment',
    icon: 'i-famicons-film-sharp',
    color: 'purple',
    transactionTypeId: 1,
  },
  {
    name: 'Travel',
    icon: 'i-material-symbols-light-travel',
    color: 'teal',
    transactionTypeId: 1,
  },
  {
    name: 'Education',
    icon: 'i-gridicons-book',
    color: 'indigo',
    transactionTypeId: 1,
  },
  {
    name: 'Salary',
    icon: 'i-material-symbols-attach-money-rounded',
    color: 'green',
    transactionTypeId: 2,
  },
  {
    name: 'Freelance',
    icon: 'i-material-symbols-work',
    color: 'orange',
    transactionTypeId: 2,
  },
  {
    name: 'Investment',
    icon: 'i-mdi-chart-line-variant',
    color: 'blue',
    transactionTypeId: 2,
  },
  {
    name: 'Gifts',
    icon: 'i-material-symbols-redeem',
    color: 'purple',
    transactionTypeId: 2,
  },
  {
    name: 'Bonus',
    icon: 'i-material-symbols-card-giftcard',
    color: 'teal',
    transactionTypeId: 2,
  },
  {
    name: 'Transfer (Out)',
    icon: 'i-material-symbols-arrow-circle-up-rounded',
    color: 'red',
    transactionTypeId: 3,
  },
  {
    name: 'Transfer (In)',
    icon: 'i-material-symbols-arrow-circle-down-rounded',
    color: 'blue',
    transactionTypeId: 4,
  },
];

async function main() {
  await prisma.accountType.createMany({
    data: accountTypeData,
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
