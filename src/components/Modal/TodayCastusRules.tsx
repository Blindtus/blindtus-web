'use client';

import { useTranslations } from 'next-intl';

import { DialogTitle } from '@/components/ui/dialog';

const TodayCastusRules = () => {
  const __ = useTranslations();

  return (
    <>
      <DialogTitle className="leading-6">{__('!text:today-rules-castus-title')}</DialogTitle>

      <div>
        <ol className="mt-4 list-decimal space-y-4 pl-5 text-left text-base text-neutral-300">
          <li>
            {/* __('!text:today-rules-blindtus-try-count') */}
            {__.rich('!text:today-rules-blindtus-try-count', {
              count: 5,
              b: (chunks) => <b className="font-semibold text-neutral-100">{chunks}</b>,
            })}
          </li>
          <li>{__('!text:today-rules-castus-progression')}</li>
          <li>
            {/* __('!text:today-rules-blindtus-franchise') */}
            {__.rich('!text:today-rules-blindtus-franchise', {
              b: (chunks) => <b className="font-semibold text-neutral-100">{chunks}</b>,
            })}
          </li>
        </ol>
      </div>
    </>
  );
};

export default TodayCastusRules;
