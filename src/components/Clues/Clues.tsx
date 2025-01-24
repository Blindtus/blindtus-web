import React, { useEffect, useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import Actor from '@/components/Media/Actor';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import useViewport from '@/hooks/use-viewport';
import { cn } from '@/lib/utils';
import { type LocalMediaType, LocalMediaTypes } from '@/types/category.type';
import { type Media, MediaStatus } from '@/types/media.type';
import { getCurrentLocale } from '@/utils/i18nUtils';

type CluesProps = {
  className?: string;
  media: Media;
  mediaType: LocalMediaType;
  currentStep?: number;
  expandAll?: boolean;
};

const Clues = ({ className, media, currentStep = 0, mediaType, expandAll = false }: CluesProps) => {
  const __ = useTranslations();
  const currentLocale = getCurrentLocale();
  const [tabValue, setTabValue] = useState<Array<string>>([]);
  const { isXs } = useViewport();

  useEffect(() => {
    setTabValue((prev) => [...prev, `tab-${currentStep}`]);
  }, [currentStep]);

  useEffect(() => {
    if (expandAll) {
      setTabValue(['tab-1', 'tab-2', 'tab-3', 'tab-4']);
    }
  }, [expandAll]);

  const cluesAttempt1 = useMemo(() => {
    switch (mediaType) {
      case LocalMediaTypes.MOVIES:
        return (
          <div className="flex flex-col gap-2">
            <div>{__('!text:clue-release-date')}</div>
            <div className="text-xl font-semibold">{media.releaseDate}</div>
          </div>
        );
      case LocalMediaTypes.TVSHOWS:
        return (
          <div className="flex flex-col gap-2">
            <div>{__('!text:clue-broadcast-years')}</div>
            <div className="text-xl font-semibold">
              {media.releaseDate} -{' '}
              {media.status === MediaStatus.RETURNING ? __('!noun:returning-serie') : media.endDate}
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [mediaType, __, media]);

  const cluesAttempt2 = useMemo(() => {
    switch (mediaType) {
      case LocalMediaTypes.MOVIES:
        return (
          <div className="flex flex-col gap-2">
            <div>{__('!text:clue-directors')}</div>
            <div className="text-xl font-semibold">{media.directors?.join(', ')}</div>
          </div>
        );
      case LocalMediaTypes.TVSHOWS:
        return (
          <div className="flex flex-col gap-2">
            <div>{__('!text:clue-genres')}</div>
            <div className="text-xl font-semibold">
              {media.genresData?.map((genre) => genre[currentLocale as 'fr' | 'en']).join(', ')}
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [mediaType, __, media.directors, media.genresData, currentLocale]);

  const cluesAttempt3 = useMemo(() => {
    switch (mediaType) {
      case LocalMediaTypes.MOVIES:
      case LocalMediaTypes.TVSHOWS:
        return (
          <div className="flex flex-col gap-2">
            <div>{__('!text:clue-actors')}</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              {media.casts?.slice(0, 5).map((cast) => {
                return <Actor key={cast.name} actor={cast} isRow={isXs} />;
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [mediaType, media.casts, isXs, __]);

  const cluesAttempt4 = useMemo(() => {
    switch (mediaType) {
      case LocalMediaTypes.MOVIES:
      case LocalMediaTypes.TVSHOWS:
        return (
          <div className="flex flex-col gap-2">
            <div>{__('!text:clue-overview')}</div>
            <div>{media.overview?.[currentLocale as 'en' | 'fr']}</div>
          </div>
        );

      default:
        return null;
    }
  }, [mediaType, media, __, currentLocale]);

  return (
    <Accordion
      className={cn('flex flex-col gap-4', className)}
      type="multiple"
      value={tabValue}
      onValueChange={(tab) => setTabValue(tab)}
    >
      {currentStep >= 1 ? (
        <AccordionItem value="tab-1" className="rounded-md bg-slate-900 px-4">
          <AccordionTrigger className="hover:no-underline">
            {__('!noun:clue', { clue: 1 })}
          </AccordionTrigger>
          <AccordionContent>
            <div>{cluesAttempt1}</div>
          </AccordionContent>
        </AccordionItem>
      ) : null}

      {currentStep >= 2 ? (
        <AccordionItem value="tab-2" className="rounded-md bg-slate-900 px-4">
          <AccordionTrigger className="hover:no-underline">
            {__('!noun:clue', { clue: 2 })}
          </AccordionTrigger>
          <AccordionContent>
            <div>{cluesAttempt2}</div>
          </AccordionContent>
        </AccordionItem>
      ) : null}

      {currentStep >= 3 ? (
        <AccordionItem value="tab-3" className="rounded-md bg-slate-900 px-4">
          <AccordionTrigger className="hover:no-underline">
            {__('!noun:clue', { clue: 3 })}
          </AccordionTrigger>
          <AccordionContent>
            <div>{cluesAttempt3}</div>
          </AccordionContent>
        </AccordionItem>
      ) : null}

      {currentStep >= 4 ? (
        <AccordionItem value="tab-4" className="rounded-md bg-slate-900 px-4">
          <AccordionTrigger className="hover:no-underline">
            {__('!noun:clue', { clue: 4 })}
          </AccordionTrigger>
          <AccordionContent>
            <div>{cluesAttempt4}</div>
          </AccordionContent>
        </AccordionItem>
      ) : null}
    </Accordion>
  );
};

export default Clues;
