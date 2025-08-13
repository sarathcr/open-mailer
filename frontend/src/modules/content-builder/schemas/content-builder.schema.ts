import { z } from 'zod';
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

export const contentBuilderSchema = z.object({
  smtp: z.string().nonempty('SMTP is required'),
  template: z.string().nonempty('Template is required'),
  recipient: z
    .array(z.string().email('Invalid email format'))
    .nonempty('Recipient is required'),
  subject: z.string().nonempty('Subject is required'),
  heading: z.string().optional().nullable(),
  cc: z.array(z.string().email('Invalid email format')).optional(),
  bcc: z.array(z.string().email('Invalid email format')).optional(),
  from: z
    .string()
    .optional()
    .refine((value) => !value || fromNameSchema().safeParse(value).success, {
      message: 'Invalid value for "from"',
    }),
  sendSeparately: z.boolean().optional(),
});
