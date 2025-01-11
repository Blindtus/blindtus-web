import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

import { getMessages } from '@/i18n/i18n';

import ClientContext from './ClientContext';

type Props = {
  children: React.ReactNode;
};

export async function I18nProvider({ children }: Props) {
  const locale = await getLocale();
  const messages = getMessages(locale);

  return (
    <NextIntlClientProvider messages={messages}>
      <ClientContext>{children}</ClientContext>
    </NextIntlClientProvider>
  );
}
