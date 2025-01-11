import { getRequestConfig } from 'next-intl/server';

import LocaleEN from '../locales/en';
import LocaleFR from '../locales/fr';
import { getUserLocale } from './locale';

export const jedToI18n = (jed: { messages: Record<string, Array<string | null>> }) => {
  const i18n: Record<string, string> = {};
  const { messages } = jed;

  Object.entries(messages).forEach(([key, value]) => {
    i18n[key] = value[1] || value[0] || '';
  });

  return i18n;
};

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  const messagesFile = await import(`../locales/${locale}.js`);

  const messages = jedToI18n(messagesFile.default);

  return {
    locale,
    messages,
  };
});

const translations: { [key: string]: { messages: Record<string, Array<string | null>> } } = {
  en: LocaleEN,
  fr: LocaleFR,
};

export const getMessages = (locale: string) => {
  return jedToI18n(translations[locale ?? 'en']);
};

export const transformStringToKey = (input: string) => {
  return input
    .toLowerCase() // Ensure the string is in lowercase
    .split('-') // Split the string by the delimiter (hyphen)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(''); // Join them back together without any spaces or delimiters
};
