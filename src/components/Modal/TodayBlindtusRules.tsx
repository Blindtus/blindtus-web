'use client';

import { useEffect, useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { getOrdinal } from '@/i18n/i18n';
import { getUserLocale } from '@/i18n/locale';

const TodayBlindtusRules = () => {
  const __ = useTranslations();
  const [userLocale, setUserLocale] = useState<string | null>(null);

  const locale = useMemo(async () => {
    return await getUserLocale();
  }, []);

  useEffect(() => {
    (async () => {
      setUserLocale(await locale);
    })();
  }, [locale]);

  return (
    <>
      <DialogTitle className="leading-6">{__('!text:today-rules-blindtus-title')}</DialogTitle>

      <DialogDescription>
        <ol className="mt-4 list-decimal space-y-4 pl-4 text-left text-base text-neutral-300">
          <li>
            {/* __('!text:today-rules-blindtus-try-count') */}
            {__.rich('!text:today-rules-blindtus-try-count', {
              count: 5,
              b: (chunks) => <b className="font-semibold text-neutral-100">{chunks}</b>,
            })}
          </li>
          <li>
            {__('!text:today-rules-blindtus-progression')}
            <ul className="list-disc pl-4">
              {[5, 10, 20, 40, 60].map((seconds, index) => {
                const ordinal = getOrdinal(index + 1, userLocale);
                // __('!text:today-rules-blindtus-progression-item');
                return (
                  <li key={seconds}>
                    {__('!text:today-rules-blindtus-progression-item', {
                      ordinal,
                      seconds,
                    })}
                  </li>
                );
              })}
            </ul>
          </li>
          <li>
            {/* __('!text:today-rules-blindtus-franchise') */}
            {__.rich('!text:today-rules-blindtus-franchise', {
              b: (chunks) => <b className="font-semibold text-neutral-100">{chunks}</b>,
            })}
          </li>
          <li>
            {/* {__('!text:today-rules-blindtus-last-try')} */}
            {__.rich('!text:today-rules-blindtus-last-try', {
              b: (chunks) => <b className="font-semibold text-neutral-100">{chunks}</b>,
            })}
          </li>
        </ol>
      </DialogDescription>
    </>
  );
};

export default TodayBlindtusRules;
