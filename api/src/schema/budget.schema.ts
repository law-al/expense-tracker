import { z } from 'zod';

export const CreateBudgetSchema = z.object({
  categoryId: z.number({ error: 'Category is required' }),
  name: z.string().optional(),
  amount: z.number({ error: 'Amount is required' }),
  period: z.string({ error: 'Period is required' }),
});
