import { z } from 'zod';

export const RoadmapValidation = z.object({
  titleEn: z.string().nonempty(),
  titleFr: z.string().nonempty(),
  descriptionEn: z.string(),
  descriptionFr: z.string(),
  tagsEn: z.array(z.string()),
  tagsFr: z.array(z.string()),
});
