import * as z from 'zod';

export const apitokenSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'name is required'),
  duration: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
});

export type APITokenFormInputs = z.infer<typeof apitokenSchema>;

export type APITokenInputs = APITokenFormInputs & {
  createdAt?: string;
  deletedAt?: string;
  expireAt?: string;
};
