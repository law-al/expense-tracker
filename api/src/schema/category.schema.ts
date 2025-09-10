import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z
    .string({ error: 'Category name is required' })
    .min(1, 'Category name cannot be empty'),
  icon: z.string().optional(),
  color: z.string().optional(),
  parentId: z.number().optional(),
});
