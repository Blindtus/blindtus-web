import type { Metadata, Viewport } from 'next';
import { Inter as FontSans } from 'next/font/google';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { getUserLocale } from '@/i18n/locale';
import { QueryProvider } from '@/lib/react-query/QueryProvider';

import './globals.css';
import { I18nProvider } from './localProvider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://blindtus.com'),
  title: {
    template: '%s | Blindtus',
    default: 'Blindtus - Daily music quiz',
  },
  description:
    'Quiz site for movie and TV show lovers! Every day, try to guess the music in different categories: Film, TV Series, Cartoon, Video Games! Also, try other categories: pixelated posters, movies featuring specific actors, or even guess the release date.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Blindtus - Daily music quiz',
    description:
      'Quiz site for movie and TV show lovers! Every day, try to guess the music in different categories: Film, TV Series, Cartoon, Video Games! Also, try other categories: pixelated posters, movies featuring specific actors, or even guess the release date.',
    url: 'https://blindtus.com',
    siteName: 'Blindtus',

    images: [
      {
        url: 'https://blindtus.com/cover.png',
        width: 800,
        height: 382,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@blindtus',
    creator: '@cl3tus_',
    images: 'https://blindtus.com/cover.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getUserLocale();
  return (
    <html lang={locale}>
      <body className={fontSans.variable}>
        <NuqsAdapter>
          <QueryProvider>
            <AuthProvider>
              <I18nProvider>
                {children}
                <Toaster />
              </I18nProvider>
            </AuthProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
