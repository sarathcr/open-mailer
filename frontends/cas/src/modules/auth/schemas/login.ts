import { passwordSchema } from '@/modules/password/schemas';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: passwordSchema(),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;
