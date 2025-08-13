import { z } from 'zod';

export const nameSchema = z.object({
  name: z.string().min(5, 'Template name must be at least 5 characters long'),
});

export type nameFormInputs = z.infer<typeof nameSchema>;
