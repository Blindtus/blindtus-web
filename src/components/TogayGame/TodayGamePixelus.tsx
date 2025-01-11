import { useCallback, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import JSConfetti from 'js-confetti';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import MediaPoster from '@/components/Poster/MediaPoster';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTodayGame } from '@/context/TodayGameContext';
import useViewport from '@/hooks/use-viewport';
import { TodayGameValidation } from '@/lib/validations/today';
import { type SimilarityStatusType, similarityStatus } from '@/utils/similarityUtils';

import TodayGameStatus from './TodayGameStatus';

const TodayGamePixelus = () => {
  const __ = useTranslations();
  const [status, setStatus] = useState<SimilarityStatusType | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const { currentStep, checkAnswer, pixelus } = useTodayGame();
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
        const answerStatus = checkAnswer?.(data.answer) || similarityStatus.WRONG;
        const isCorrect = answerStatus === similarityStatus.CORRECT;
        setIsAnswerCorrect(isCorrect);
        setStatus(answerStatus);
        form.reset();

        if (isCorrect) {
          const jsConfetti = new JSConfetti();
          jsConfetti.addConfetti();
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

          <Button type="submit" variant={!!watchAnswer ? 'primary' : 'secondary'}>
            {buttonLabel}
          </Button>
        </form>
      </Form>

      {status ? <TodayGameStatus status={status} /> : null}

      <div className="w-full max-w-full md:w-96">
        <MediaPoster
          title="Find the media"
          posterPath={pixelus?.images[currentStep] ?? undefined}
          size="medium"
          withoutUrlPrefix
        />
      </div>
    </div>
  );
};

export default TodayGamePixelus;
