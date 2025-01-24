'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

import { cva } from 'class-variance-authority';
import { Frown, Trophy } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TODAY_CATEGORIES } from '@/constants/todayCategories';
import { useGetToday } from '@/lib/react-query/TodayQueries';
import { cn } from '@/lib/utils';
import { GameTypes, type HistoryTodayDatas } from '@/types/today.type';
import { getTodayHistoryByTodayId } from '@/utils/historyUtils';

import Loader from '../Loader/Loader';

const cardVariants = cva('select-none rounded-sm text-white', {
  variants: {
    variant: {
      blindtus: 'bg-gradient-to-b from-category-tvShow to-primary-special',
      pixelus: 'bg-gradient-to-b from-category-pixelus to-primary-special',
      castus: 'bg-gradient-to-b from-category-castus to-primary-special',
      hotDate: 'bg-gradient-to-b from-category-hotDate to-primary-special',
    },
  },
});

type TodayCardProps = {
  className?: string;
  category: (typeof TODAY_CATEGORIES)[number];
};

const TodayCard = ({ className = '', category }: TodayCardProps) => {
  const router = useRouter();
  const locale = useLocale();
  const __ = useTranslations();

  const { data: todayGame, isFetched, refetch, isFetching } = useGetToday();

  useEffect(() => {
    if (!isFetching && !isFetched) {
      refetch();
    }
  }, [isFetched, isFetching, refetch]);

  const gameType = useMemo(() => {
    if (!category) {
      return;
    }

    return category.game;
  }, [category]);

  const showMaxAttempts = useMemo(
    () => category && gameType !== GameTypes.HOT_DATE,
    [category, gameType],
  );

  const userTodayHistory = useMemo(
    () => getTodayHistoryByTodayId(todayGame?._id || ''),
    [todayGame?._id],
  );

  const todayHistoryCardInfo: HistoryTodayDatas | undefined = useMemo(() => {
    if (!category || !userTodayHistory) {
      return;
    }
    return userTodayHistory[category.id];
  }, [category, userTodayHistory]);

  const isCompleted = useMemo(() => {
    if (!todayHistoryCardInfo) {
      return false;
    }

    return todayHistoryCardInfo?.isCompleted;
  }, [todayHistoryCardInfo]);

  const showIcon = useMemo(() => {
    if (!isFetched) {
      return null;
    }

    if (todayHistoryCardInfo?.isCorrect) {
      return <Trophy size={18} />;
    }

    if (todayHistoryCardInfo?.attempts.length === 5) {
      return <Frown size={18} />;
    }

    return null;
  }, [isFetched, todayHistoryCardInfo?.attempts.length, todayHistoryCardInfo?.isCorrect]);

  const attemptsCount = useMemo(() => {
    if (!todayHistoryCardInfo || !isFetched) {
      return 0;
    }

    return todayHistoryCardInfo?.attempts.length;
  }, [isFetched, todayHistoryCardInfo]);

  const handleOpenGame = useCallback(() => {
    router.push(`/today/${category?.slug}`);
  }, [category?.slug, router]);

  return (
    <Card
      className={cn(
        cardVariants({ variant: category.game }),
        'cursor-pointer rounded-md',
        className,
      )}
      onClick={handleOpenGame}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{category.label[locale]}</span> {category?.icon}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <Button variant={isCompleted ? 'tertiary' : 'secondary'} asChild>
          {isFetching ? (
            <Loader size="small" />
          ) : (
            <Link href={`/today/${category?.slug}`}>
              {isCompleted ? __('!noun:played') : __('!noun:play')}
            </Link>
          )}
        </Button>
        <div className="flex items-center gap-2">
          {isFetching ? (
            <Loader size="small" />
          ) : (
            <>
              {showIcon}
              <span>
                {attemptsCount ?? 0}
                {showMaxAttempts ? '/5' : null}
              </span>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TodayCard;
