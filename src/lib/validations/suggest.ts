import { z } from 'zod';

export const SuggestSearchValidation = z.object({
  title: z.string(),
});
