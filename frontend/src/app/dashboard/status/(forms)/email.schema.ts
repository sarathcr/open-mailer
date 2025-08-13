import { z } from 'zod';

export const retryEmailSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  smtpConfigId: z.string().optional(),
});

export type RetryEmail = z.infer<typeof retryEmailSchema>;
