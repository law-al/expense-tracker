import { z } from 'zod';
import { createErrorMap } from 'zod-validation-error';

z.config({
  customError: createErrorMap({}),
});

enum Currency {
  USD = 'USD',
  NGN = 'NGN',
}

export const CreateAccountSchema = z.object({
  name: z.string().optional(),
  accountTypeId: z
    .number({
      error: 'Account type is required',
    })
    .min(1, 'Account type is required'),
  currency: z.enum(Currency).default(Currency.USD),
  openingBalance: z
    .number({
      error: 'Opening balance is required',
    })
    .min(0, 'Balance must be a positive number'),
  currentBalance: z
    .number()
    .min(0, 'Balance must be a positive number')
    .optional(),
});
