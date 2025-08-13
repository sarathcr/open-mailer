import { z } from 'zod';

export const passwordSchema = (errorMessage: string = 'Password is invalid') =>
  z
    .string()
    .min(1, 'Password is required')
    .refine(
      (value) =>
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        ),
      {
        message: errorMessage,
      }
    );
