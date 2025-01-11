import { COOKIE_NAME_LOCALE } from '@/i18n/config';

import { getCookie } from './cookieUtils';

export const getCurrentLocale = () => {
  return getCookie(COOKIE_NAME_LOCALE) || 'en';
};
