import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'image.tmdb.org',
        port: '',
      },
      {
        protocol: 'http' as const,
        hostname: 'localhost',
        port: '4040',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
