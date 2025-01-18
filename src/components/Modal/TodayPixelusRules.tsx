'use client';

import { useTranslations } from 'next-intl';

import { DialogDescription, DialogTitle } from '@/components/ui/dialog';

const TodayPixelusRules = () => {
  const __ = useTranslations();

  return (
    <>
      <DialogTitle className="leading-6">{__('!text:today-rules-pixelus-title')}</DialogTitle>

      <DialogDescription>
        <ol className="mt-4 list-decimal space-y-4 pl-4 text-left text-base text-neutral-300">
          <li>
            {/* __('!text:today-rules-blindtus-try-count') */}
            {__.rich('!text:today-rules-blindtus-try-count', {
              count: 5,
              b: (chunks) => <b className="font-semibold text-neutral-100">{chunks}</b>,
            })}
          </li>
          <li>{__('!text:today-rules-pixelus-progression')}</li>
          <li>
            {/* __('!text:today-rules-blindtus-franchise') */}
            {__.rich('!text:today-rules-blindtus-franchise', {
              b: (chunks) => <b className="font-semibold text-neutral-100">{chunks}</b>,
            })}
          </li>
        </ol>
      </DialogDescription>
    </>
  );
};

export default TodayPixelusRules;
