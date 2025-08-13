import { z } from 'zod';
import { passwordSchema } from './password';

export const changePasswordSchema = z
  .object({
    password: passwordSchema(
      'Password must be at least 8 characters long, with one lowercase letter, one uppercase letter, one number, and one special character.'
    ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type changePasswordInputs = z.infer<typeof changePasswordSchema>;
