import { z } from 'zod';
import { createErrorMap } from 'zod-validation-error';

z.config({
  customError: createErrorMap(),
});

export const CreateBudgetSchema = z.object({
  categoryId: z.number({ error: 'Category is required' }),
  name: z.string().optional(),
  amount: z.number({ error: 'Amount is required' }),
  period: z.string({ error: 'Period is required' }),
});
