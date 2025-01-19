import type { Metadata, Viewport } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { cookies } from 'next/headers';

import PlausibleProvider from 'next-plausible';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { HistoryProvider } from '@/context/RouterContext';
import { getUserLocale } from '@/i18n/locale';
import { QueryProvider } from '@/lib/react-query/QueryProvider';

import './globals.css';
import { I18nProvider } from './localProvider';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});
// };

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const locale: 'fr' | 'en' = ((await cookieStore).get('locale')?.value as 'fr' | 'en') || 'en';

  const translations = {
    en: {
      title: 'Blindtus - The Ultimate Movie and TV Show Guessing Game',
      description:
        'Challenge your knowledge of cinema and TV with Blindtus. Guess movies and TV shows by music, posters, or actors in our fun and interactive game modes: Blindtus, Pixelus, Castus and Hot Date!',
    },
    fr: {
      title: 'Blindtus - Le Jeu Ultime pour Deviner des Films et Séries',
      description:
        'Mettez à l’épreuve vos connaissances en cinéma et séries avec Blindtus. Devinez des films et séries grâce à la musique, aux affiches ou aux acteurs dans nos modes de jeu amusants et interactifs : Blindtus, Pixelus, Castus et Hot Date!',
    },
  };

  const { title, description } = translations[locale] || translations['en'];

  return {
    metadataBase: new URL('https://blindtus.com'),
    title: {
      template: '%s | Blindtus',
      default: title,
    },
    description,
    icons: {
      icon: '/favicon.ico',
    },
    openGraph: {
      title: 'Blindtus - Daily music quiz',
      description: description,
      url: 'https://blindtus.com',
      siteName: 'Blindtus',

      // images: [
      //   {
      //     url: 'https://blindtus.com/cover.png',
      //     width: 800,
      //     height: 382,
      //   },
      // ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@blindtus',
      creator: '@cl3tus_',
      // images: 'https://blindtus.com/cover.png',
    },
  };
}

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
      <link rel="alternate" hrefLang="fr" href="https://blindtus.com" />
      <link rel="alternate" hrefLang="en" href="https://blindtus.com" />
      <link rel="alternate" hrefLang="x-default" href="https://blindtus.com" />
      <body className={fontSans.variable}>
        <PlausibleProvider
          domain="blindtus.com"
          customDomain="https://plausible.cl3tus.com"
          selfHosted
        >
          <HistoryProvider>
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
          </HistoryProvider>
        </PlausibleProvider>
      </body>
    </html>
  );
}
