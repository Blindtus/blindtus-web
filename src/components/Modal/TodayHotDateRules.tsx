'use client';

import { ThermometerIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const TodayHotDateRules = () => {
  const __ = useTranslations();

  return (
    <>
      <DialogTitle className="leading-6">{__('!text:today-rules-hotdate-title')}</DialogTitle>

      <div>
        <ScrollArea className="h-[55vh]">
          <ol className="mt-4 list-decimal space-y-4 pl-5 text-left text-base text-neutral-300">
            <li>{__('!text:today-rules-infinite-try-count')}</li>
            <li>
              {__('!text:today-rules-hotdate-progression')}

              <ul className="mt-4 list-disc space-y-4">
                <li className="flex gap-2">
                  <ThermometerIcon className="h-10 w-6 -translate-y-1 text-red-500" />{' '}
                  {__('!text:today-rules-hotdate-progression-hot')}
                </li>
                <li className="flex gap-2">
                  <ThermometerIcon className="h-10 w-6 -translate-y-1 text-yellow-500" />{' '}
                  {__('!text:today-rules-hotdate-progression-warm')}
                </li>
                <li className="flex gap-2">
                  <ThermometerIcon className="h-10 w-6 -translate-y-1 text-blue-500" />
                  {__('!text:today-rules-hotdate-progression-cold')}
                </li>
                <li className="flex gap-2">
                  <ThermometerIcon className="h-10 w-6 -translate-y-1 text-green-500" />
                  {__('!text:today-rules-hotdate-progression-correct')}
                </li>
              </ul>
            </li>

            <li>{__('!text:today-rules-hotdate-feedback')}</li>
          </ol>
        </ScrollArea>
      </div>
    </>
  );
};

export default TodayHotDateRules;
