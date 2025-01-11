'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';

import { cva } from 'class-variance-authority';
import { Frown, Trophy } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TODAY_CATEGORIES } from '@/constants/todayCategories';
import { useGetToday } from '@/lib/react-query/TodayQueries';
import { cn } from '@/lib/utils';
import type { HistoryTodayDatas } from '@/types/today.type';
import { getTodayHistoryByTodayId } from '@/utils/historyUtils';

import Loader from '../Loader/Loader';

const cardVariants = cva('select-none rounded-sm text-white', {
  variants: {
    variant: {
      blindtus: 'bg-gradient-to-b from-category-tvShow to-primary-special',
      pixelus: 'bg-gradient-to-b from-category-pixelus to-primary-special',
      castus: 'bg-gradient-to-b from-category-castus to-primary-special',
    },
  },
});

type TodayCardProps = {
  className?: string;
  category: (typeof TODAY_CATEGORIES)[number];
};

const TodayCard = ({ className = '', category }: TodayCardProps) => {
  const locale = useLocale();
  const __ = useTranslations();

  const { data: todayGame, isFetched, refetch, isFetching } = useGetToday();

  useEffect(() => {
    if (!isFetching && !isFetched) {
      refetch();
    }
  }, [isFetched, isFetching, refetch]);

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

  return (
    <Card className={cn(cardVariants({ variant: category.game }), className)}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{category.label[locale]}</span> {category?.icon}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <Button variant="secondary" asChild>
          {isFetching ? (
            <Loader size="small" />
          ) : (
            <Link href={`/today/${category?.slug}`}>{__('!noun:play')}</Link>
          )}
        </Button>
        <div className="flex items-center gap-2">
          {isFetching ? (
            <Loader size="small" />
          ) : (
            <>
              {showIcon}
              <span>{attemptsCount ?? 0}/5</span>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TodayCard;
