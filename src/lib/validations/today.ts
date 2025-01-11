import { z } from 'zod';

export const TodayGameValidation = z.object({
  answer: z.string(),
});
