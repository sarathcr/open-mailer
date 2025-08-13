import { z } from 'zod';

export const editorSchema = z.object({
  footerContent: z.string().refine(
    (value) => {
      const plainText = value.replace(/<\/?[^>]+(>|$)/g, '').trim();
      return plainText.length >= 20;
    },
    { message: 'Footer content must be at least 20 characters long.' }
  ),
});
