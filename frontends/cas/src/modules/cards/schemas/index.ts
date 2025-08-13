import { z } from 'zod';

export const cardSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  url: z.string().min(1, 'Url is required'),
  description: z.string().optional(),
});

export type CardFormInputs = z.infer<typeof cardSchema>;
