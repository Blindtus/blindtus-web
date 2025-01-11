export type Locale = (typeof locales)[number];

export const COOKIE_NAME_LOCALE = 'locale';

export const locales = ['en', 'fr'] as const;
export const defaultLocale: Locale = 'en';
