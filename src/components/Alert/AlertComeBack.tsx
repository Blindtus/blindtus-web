'use client';

import { useMemo } from 'react';

import { addDays, format, isAfter } from 'date-fns';
import { useLocale, useTranslations } from 'next-intl';

import { Alert } from '@/components/ui/alert';
import { TODAY_CATEGORIES } from '@/constants/todayCategories';
import { useGetToday } from '@/lib/react-query/TodayQueries';
import { cn } from '@/lib/utils';
import { formatDateFr } from '@/utils/date';
import { getTodayHistoryByTodayId } from '@/utils/historyUtils';

type Props = {
  className?: string;
};

const AlertComeBack = ({ className = '' }: Props) => {
  const { data: today } = useGetToday();
  const __ = useTranslations();
  const locale = useLocale();

  const showAlert = useMemo(() => {
    if (!today) {
      return false;
    }

    const history = getTodayHistoryByTodayId(today?._id);

    // check if all games are played
    return TODAY_CATEGORIES.every((category) => {
      return history?.[category.id]?.isCompleted;
    });
  }, [today]);

  const resetTime = useMemo(() => {
    const now = new Date();
    const resetTimeGMT = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0),
    );

    // If the current time is after today's reset time, calculate the next day's reset
    const nextResetTime = isAfter(now, resetTimeGMT) ? addDays(resetTimeGMT, 1) : resetTimeGMT;

    // Format the reset time for the user's local timezone
    const resetTimeLocal =
      locale === 'fr' ? formatDateFr(nextResetTime, 'p') : format(nextResetTime, 'p');
    const resetDateLocal =
      locale === 'fr' ? formatDateFr(nextResetTime, 'PP') : format(nextResetTime, 'PP');

    return {
      resetTimeLocal,
      resetDateLocal,
    };
  }, [locale]);

  if (!showAlert) {
    return null;
  }

  return (
    <Alert variant="success" className={cn(className)}>
      {/* {__('!text:alert-come-back')} */}
      {__.rich('!text:alert-come-back', {
        time: resetTime.resetTimeLocal,
        date: resetTime.resetDateLocal,
        b: (chunks) => <b className="font-semibold text-emerald-100">{chunks}</b>,
      })}
    </Alert>
  );
};

export default AlertComeBack;
