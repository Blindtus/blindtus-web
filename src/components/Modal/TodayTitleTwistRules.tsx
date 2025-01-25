'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import Loader from '@/components/Loader';
import { DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUserLocale } from '@/i18n/locale';

const TodayTitleTwistRules = () => {
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
      <DialogTitle className="leading-6">{__('!text:today-rules-titletwist-title')}</DialogTitle>

      <div>
        <ScrollArea>
          <ol className="mt-4 list-decimal space-y-4 pl-5 text-left text-base text-neutral-300">
            <li>
              {/* __('!text:today-rules-blindtus-try-count') */}
              {__.rich('!text:today-rules-blindtus-try-count', {
                count: 5,
                b: (chunks) => <b className="font-semibold text-neutral-100">{chunks}</b>,
              })}
            </li>
            <li>{__('!text:today-rules-titletwist-progression')}</li>
            <li>{__('!text:today-rules-titletwist-result')}</li>
          </ol>
        </ScrollArea>
      </div>
    </>
  );
};

export default TodayTitleTwistRules;
