import z from 'zod';
import { createErrorMap } from 'zod-validation-error';

z.config({
  customError: createErrorMap(),
});

export const ChangeUserPasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, 'Current password must be at least 6 characters long'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters long'),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
  });
