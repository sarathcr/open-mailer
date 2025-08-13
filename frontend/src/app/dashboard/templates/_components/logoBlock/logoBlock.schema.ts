import { z } from 'zod';
export const logoBlockSchema = z.object({
  isEnable: z.boolean().optional(),
  imageUrl: z
    .string()
    .url('Please provide a valid URL for the secondary image')
    .nonempty('Secondary image URL is required')
    .refine((url) => /\.(jpg|jpeg|png|gif)$/i.test(url), {
      message: 'URL must point to an image file (jpg, jpeg, png, gif)',
    }),
  linkUrl: z
    .string()
    .url('Please provide a valid URL for the secondary link')
    .nonempty('Secondary image URL is required'),
  bg: z
    .string()
    .min(3, 'Secondary background is required')
    .max(10, 'Invalid color')
    .nonempty('Secondary image URL is required')
    .refine((value) => value?.trim() !== '' && value === value?.trimStart(), {
      message: 'Enter a valid Secondary color',
    }),
});
