'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import Loader from '@/components/Loader';
import { DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getOrdinal } from '@/i18n/i18n';
import { getUserLocale } from '@/i18n/locale';

const TodayBlindtusRules = () => {
  const __ = useTranslations();
  const [userLocale, setUserLocale] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocale = async () => {
      const locale = await getUserLocale();
      setUserLocale(locale); // Update state after resolving the async function
    };

    fetchLocale(); // Invoke the async function
  }, []); // Empty dependency array ensures this runs only once

  if (userLocale === null) {
    // Optionally handle loading state
    return (
      <DialogTitle>
        <Loader />
      </DialogTitle>
    );
  }

  return (
    <>
      <DialogTitle className="leading-6">{__('!text:today-rules-blindtus-title')}</DialogTitle>

      <div>
        <ScrollArea className="h-[50vh]">
          <ol className="mt-4 list-decimal space-y-4 pl-5 text-left text-base text-neutral-300">
            <li>
              {/* __('!text:today-rules-blindtus-try-count') */}
              {__.rich('!text:today-rules-blindtus-try-count', {
                count: 5,
                b: (chunks) => <b className="font-semibold text-neutral-100">{chunks}</b>,
              })}
            </li>
            <li>
              {__('!text:today-rules-blindtus-progression')}
              <ul className="list-disc pl-5">
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
                count: 6,
                b: (chunks) => <b className="font-semibold text-neutral-100">{chunks}</b>,
              })}
            </li>
          </ol>
        </ScrollArea>
      </div>
    </>
  );
};

export default TodayBlindtusRules;
