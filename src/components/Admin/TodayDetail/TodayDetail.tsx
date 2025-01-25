'use client';

import { useCallback, useMemo } from 'react';

import { format } from 'date-fns';

import AudioPlayer from '@/components/AudioPlayer';
import Loader from '@/components/Loader/Loader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useGetTodayById, useRegenerateTodayGame } from '@/lib/react-query/TodayQueries';
import type { Music } from '@/types/audio.type';
import type { Media } from '@/types/media.type';
import type { PixelatedImage } from '@/types/pixelatedImage.type';
import { type GameType } from '@/types/today.type';

type TodayDetailProps = {
  todayId: string;
};

const TodayDetail = ({ todayId }: TodayDetailProps) => {
  const { data: today, isFetching: isTodayFetching } = useGetTodayById(todayId);

  if (isTodayFetching) {
    return <Loader />;
  }

  if (!today) {
    return (
      <div>
        <h1>Today not found</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-8 justify-between md:flex">
        <div>
          <h1 className="page-title--sm">Today - {format(today.createdAt, 'dd MMM yyyy')}</h1>
        </div>
      </div>
      <div className="mt-12 flex flex-col gap-8">
        <TodayDetailItem
          todayId={todayId}
          todayItem={today.blindtus}
          type="audios"
          category="blindtus"
        />
        <TodayDetailItem todayId={todayId} todayItem={today.pixelus} category="pixelus" />
        <TodayDetailItem todayId={todayId} todayItem={today.castus} category="castus" />
        <TodayDetailItem todayId={todayId} todayItem={today.hotDate} category="hotDate" />
        <TodayDetailItem todayId={todayId} todayItem={today.titleTwist} category="titleTwist" />
      </div>
    </div>
  );
};

type TodayDetailItemProps = {
  todayId: string;
  todayItem?: Music | PixelatedImage | Media;
  type?: string;
  category: GameType;
};

const TodayDetailItem = ({ todayId, todayItem, category }: TodayDetailItemProps) => {
  const { mutateAsync: generateNewTodayItem, isPending: isUpdatePending } =
    useRegenerateTodayGame();

  const handleGenerateNewTodayItem = useCallback(async () => {
    try {
      generateNewTodayItem({ todayId, [category]: true });
    } catch (error) {
      throw new Error(error as string);
    }
  }, [category, generateNewTodayItem, todayId]);

  const media = useMemo(() => {
    if (todayItem && 'media' in todayItem) {
      return todayItem.media;
    }
    return todayItem;
  }, [todayItem]);

  return (
    <div>
      <div className="flex items-start justify-between">
        <h3 className="text-xl">{category}</h3>
        <Button variant="secondary" disabled={isUpdatePending} onClick={handleGenerateNewTodayItem}>
          {isUpdatePending ? 'Generating...' : 'Re-generate'}
        </Button>
      </div>

      {media ? (
        <Accordion type="single" collapsible>
          <AccordionItem value="movie-audio-details">
            <AccordionTrigger>Details</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4">
                <h3>{media.title.fr}</h3>
                {todayItem && 'audioPath' in todayItem ? (
                  <AudioPlayer src={todayItem.audioPath || ''} />
                ) : (
                  <div>{todayId}</div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <p>No {category} found</p>
      )}
    </div>
  );
};

export default TodayDetail;
