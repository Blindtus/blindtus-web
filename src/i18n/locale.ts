'use server';

import { cookies } from 'next/headers';

import { COOKIE_NAME_LOCALE, type Locale, defaultLocale } from './config';

export async function getUserLocale() {
  const locale = (await cookies()).get(COOKIE_NAME_LOCALE);
  return locale?.value || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME_LOCALE, locale);
}
