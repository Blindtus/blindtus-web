'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Check, CircleAlert, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePlausible } from 'next-plausible';

import { useGetToday } from '@/lib/react-query/TodayQueries';
import { copyToClipboardTodayHistoryGamnes } from '@/utils/copyUtils';
import { getTodayHistoryByTodayId } from '@/utils/historyUtils';

import { Button } from '../ui/button';

type ShareTodayResultsProps = {
  className?: string;
};

const ShareTodayResults = ({ className = '' }: ShareTodayResultsProps) => {
  const __ = useTranslations();
  const [isCopied, setIsCopied] = useState(false);
  const [isError, setIsError] = useState(false);
  const plausible = usePlausible();

  const { data: today, isFetching } = useGetToday();

  const history = useMemo(() => {
    if (!today || !today._id) {
      return null;
    }

    return getTodayHistoryByTodayId(today?._id);
  }, [today]);

  useEffect(() => {
    // reset stated after 2 seconds
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
        setIsError(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  const handleClick = useCallback(async () => {
    setIsCopied(false);
    setIsError(false);

    if (!today || !today._id) {
      return;
    }

    const response = await copyToClipboardTodayHistoryGamnes(today?._id);
    setIsCopied(true);
    setIsError(response.isError);
    plausible('share');
  }, [plausible, today]);

  const message = useMemo(() => {
    if (isCopied) {
      return isError ? (
        <>
          {__('!text:copy-error')} <CircleAlert size={16} className="ml-2" />
        </>
      ) : (
        <>
          {__('!text:copy-success')} <Check size={16} className="ml-2" />
        </>
      );
    }

    return (
      <>
        {__('!text:copy-results')} <Copy size={16} className="ml-2" />
      </>
    );
  }, [__, isCopied, isError]);

  const buttonVariant = useMemo(() => {
    if (isCopied) {
      return isError ? 'destructive' : 'success';
    }

    return 'secondary';
  }, [isCopied, isError]);

  if (!today || isFetching) {
    return null;
  }

  return (
    <Button className={className} variant={buttonVariant} onClick={handleClick} disabled={!history}>
      {message}
    </Button>
  );
};

export default ShareTodayResults;
