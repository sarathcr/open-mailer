import { z } from 'zod';

export const textContentSchema = z.string().refine(
  (value) => {
    const plainText = value.replace(/<\/?[^>]+(>|$)/g, '').trim();
    return plainText.length >= 20;
  },
  { message: ' content must be at least 20 characters long.' }
);
export const buttonContentSchema = z.object({
  buttonText: z.string().min(1, { message: 'Button text is required.' }),
  buttonLink: z.string().url({ message: 'Invalid URL format.' }),
  buttonAlign: z.enum(['left', 'center', 'right'], {
    errorMap: () => ({ message: 'Button alignment is required.' }),
  }),
});

export const buttonGroupContentSchema = z.object({
  buttons: z.array(
    z.object({
      text: z.string().min(1, { message: 'Button group text is required.' }),
      link: z.string().url({ message: 'Invalid URL format.' }),
    })
  ),
  align: z.enum(['left', 'center', 'right'], {
    errorMap: () => ({ message: 'Button group alignment is required.' }),
  }),
});

export type textContentInputs = z.infer<typeof textContentSchema>;
export type buttonContentInputs = z.infer<typeof buttonContentSchema>;
export type buttonGroupContentInputs = z.infer<typeof buttonGroupContentSchema>;
