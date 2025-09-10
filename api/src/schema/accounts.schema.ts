import { z } from 'zod';

enum Currency {
  USD = 'USD',
  NGN = 'NGN',
}

export const CreateAccountSchema = z.object({
  name: z.string().optional(),
  accountTypeId: z.number().min(1, 'Account type is required'),
  currency: z.enum(Currency).optional(),
  openingBalance: z
    .number()
    .min(0, 'Balance must be a positive number')
    .optional(),
  currentBalance: z
    .number()
    .min(0, 'Balance must be a positive number')
    .optional(),
});
