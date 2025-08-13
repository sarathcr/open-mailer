'use client';
import { z } from 'zod';
export const templateControllerSchema = z
  .object({
    isEnable: z.boolean().optional(),
    secondaryImageUrl: z
      .string()
      .url('Please provide a valid URL for the secondary image')
      .optional(),
    secondaryLinkUrl: z
      .string()
      .url('Please provide a valid URL for the secondary link')
      .optional(),
    secondaryBg: z
      .string()
      .min(3, 'Secondary background is required')
      .max(10, 'Invalid color')
      .optional()
      .refine((value) => value?.trim() !== '' && value === value?.trimStart(), {
        message: 'Enter a valid Secondary color',
      }),
    primaryImageUrl: z
      .string()
      .url('Please provide a valid URL for the primary image'),
    primaryLinkUrl: z
      .string()
      .url('Please provide a valid URL for the primary link'),
    primaryBg: z
      .string()
      .min(3, 'Primary background is required')
      .max(10, 'Invalid color')
      .refine((value) => value?.trim() !== '' && value === value?.trimStart(), {
        message: 'Enter a valid primary color',
      }),
    footerContent: z.string().refine(
      (value) => {
        const plainText = value.replace(/<\/?[^>]+(>|$)/g, '').trim();
        return plainText.length >= 20;
      },
      { message: 'Footer content must be at least 20 characters long.' }
    ),
  })
  .refine(
    (data) => {
      if (data.isEnable) {
        return (
          !!data.secondaryImageUrl &&
          isValidURL(data.secondaryImageUrl) &&
          !!data.secondaryLinkUrl &&
          isValidURL(data.secondaryLinkUrl) &&
          !!data.secondaryBg &&
          data.secondaryBg.trim() !== ''
        );
      } else {
        return true;
      }
    },
    {
      message: 'The Fields are required when isEnable is true.',
      path: ['secondaryImageUrl', 'secondaryLinkUrl', 'secondaryBg'],
    }
  );
export const templateSchema = z
  .object({
    id: z.string(),
    name: z.string().min(5, 'Template name must be at least 5 characters long'),
    templateType: z.enum(['default', 'custom'], {
      errorMap: () => ({
        message: 'Template type must be either "default" or "custom"',
      }),
    }),
    filePath: z.string().optional(),
  })
  .refine(
    (data) => {
      return (
        data.templateType === 'default' ||
        (data.templateType === 'custom' &&
          !!data.filePath &&
          isValidURL(data.filePath))
      );
    },
    {
      message: 'filePath is required and must be a valid URL',
      path: ['filePath'],
    }
  );

function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export type templateFormInputs = z.infer<typeof templateSchema>;
export type ExtendedTemplateFormInputs = templateFormInputs & {
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};
export type templateControllerFormInputs = z.infer<
  typeof templateControllerSchema
>;

export const TemplateDropDownSchema = z
  .object({
    selectedOption: z.enum(['default', 'custom']),
    filePath: z
      .string()
      .url('Please provide a valid file path URL')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.selectedOption === 'custom' && !data.filePath) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['filePath'],
        message: 'File path is required',
      });
    }
  });

export type TemplateDropDownInputs = z.infer<typeof TemplateDropDownSchema>;
