import { z } from 'zod';

export const AddMusicValidation = z.object({
  file: z.instanceof(File),
  startAt: z.number().or(z.string().transform((value) => Number(value))),
  duration: z.number().or(z.string().transform((value) => Number(value))),
  title: z.string().min(1),
  author: z.string().min(1),
});

export const UpdateAudioValidation = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
});
