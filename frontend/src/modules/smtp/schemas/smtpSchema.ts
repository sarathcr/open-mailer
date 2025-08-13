import * as z from 'zod';
export const fromNameSchema = (
  errorMessage: string = 'fromName must be in the format: "Name<email@example.com>'
) =>
  z
    .string()
    .min(1, 'fromName is required')
    .refine(
      (value) =>
        /^(?!<)([A-Za-z\s]+)<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>$/g.test(
          value
        ),
      {
        message: errorMessage,
      }
    );

export const smtpSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(1, 'username is required'),
  password: z.string().min(1, 'password is required'),
  from: fromNameSchema(),
  secure: z.boolean(),
  host: z.string().optional().nullable(),
  port: z.string().optional().nullable(),
  isBackUp: z.boolean().optional(),
});

export type SmtpFormInputs = z.infer<typeof smtpSchema> & {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};
