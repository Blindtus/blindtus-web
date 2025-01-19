import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://blindtus.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: 'https://blindtus.com',
          fr: 'https://blindtus.com',
        },
      },
    },
  ];
}
