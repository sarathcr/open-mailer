import { z } from 'zod';

export const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  isAdmin: z.boolean(),
  isActive: z.boolean(),
  id: z.string().optional(),
});

export type UserFormInputs = z.infer<typeof userSchema>;
