import { z } from 'zod';

import { createErrorMap } from 'zod-validation-error';

z.config({
  customError: createErrorMap(),
});

export const CreateTransactionSchema = z.object({
  transactionTypeId: z.number({ error: 'Transaction type is required' }),
  accountId: z.number({ error: 'Account is required' }),
  categoryId: z.number({ error: 'Category is required' }),
  amount: z.number({ error: 'Amount is required' }),
  description: z.string().optional(),
  date: z.string().optional(),
});

export const CreateTransferTransactionSchema = z.object({
  transferFromAccountId: z.number({
    error: 'Transfer from account is required',
  }),
  transferToAccountId: z.number({ error: 'Transfer to account is required' }),
  amount: z.number({ error: 'Amount is required' }),
  description: z.string().optional(),
  date: z.string().optional(),
});
