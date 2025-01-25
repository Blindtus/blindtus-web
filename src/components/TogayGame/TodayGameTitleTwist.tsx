'use client';

import { useCallback, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import JSConfetti from 'js-confetti';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTodayGame } from '@/context/TodayGameContext';
import useViewport from '@/hooks/use-viewport';
import { TodayGameValidation } from '@/lib/validations/today';
import { type SimilarityStatusType, similarityStatus } from '@/utils/similarityUtils';

import Loader from '../Loader';
import TodayGameStatus from './TodayGameStatus';

const TodayGameTitleTwist = () => {
  const __ = useTranslations();
  const locale = useLocale() as 'en' | 'fr';
  const [status, setStatus] = useState<SimilarityStatusType | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const { currentStep, checkAnswer, isLoading, media } = useTodayGame();
  const { isXs } = useViewport();

  const form = useForm<z.infer<typeof TodayGameValidation>>({
    resolver: zodResolver(TodayGameValidation),
    defaultValues: {
      answer: '',
    },
  });

  const watchAnswer = form.watch('answer');

  const onSubmit = useCallback(
    async (data: z.infer<typeof TodayGameValidation>) => {
      try {
        const answerStatus = checkAnswer?.(data.answer, true) || similarityStatus.WRONG;
        const isCorrect = answerStatus === similarityStatus.CORRECT;
        setIsAnswerCorrect(isCorrect);
        setStatus(answerStatus);
        form.reset();

        if (isCorrect) {
          const jsConfetti = new JSConfetti();
          jsConfetti.addConfetti({
            emojis: ['🍿', '🎬'],
            confettiRadius: 50,
            confettiNumber: 120,
            emojiSize: 80,
          });
        }

        window.setTimeout(() => {
          setIsAnswerCorrect(null);
        }, 500);
      } catch (error) {
        console.error(error);
      }
    },
    [checkAnswer, form],
  );

  const buttonLabel = useMemo(() => {
    if (watchAnswer !== '') {
      return isXs ? __('!noun:send') : __('!noun:send-answer');
    }

    return __('!noun:skip');
  }, [__, isXs, watchAnswer]);

  const showScrambledTitles = useMemo(() => {
    const titles: string[] = [];

    for (let i = 0; i < currentStep + 1; i++) {
      if (media?.scrambledTitles[locale][i]) {
        titles.push(media.scrambledTitles[locale][i]);
      }
    }

    return titles;
  }, [currentStep, locale, media?.scrambledTitles]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} isWiggle={isAnswerCorrect === false} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" variant="primary">
            {buttonLabel}
          </Button>
        </form>
      </Form>

      {status ? <TodayGameStatus status={status} /> : null}

      <div className="flex flex-col gap-4">
        {showScrambledTitles.map((title, index) => (
          <div key={index} className="text-4xl">
            <strong>{index + 1}.</strong> {title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayGameTitleTwist;
