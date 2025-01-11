import { z } from 'zod';

export const CategoryValidation = z.object({
  label: z.string().nonempty(),
  labelFr: z.string().nonempty(),
  type: z.string().nonempty(),
  isDisplayInGame: z.boolean().optional(),
  isDisplayInToday: z.boolean().optional(),
  isDisplayInTodayPixelux: z.boolean().optional(),
  isDisplayInTodayHotDate: z.boolean().optional(),
});
