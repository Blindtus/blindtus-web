import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/sig-in', '/googlefc6a35ada08f7cb9.html'],
    },
    sitemap: 'https://blindtus.com/sitemap.xml',
  };
}
