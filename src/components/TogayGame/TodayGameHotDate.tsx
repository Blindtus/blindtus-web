import { useCallback, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import JSConfetti from 'js-confetti';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTodayGame } from '@/context/TodayGameContext';
import useViewport from '@/hooks/use-viewport';
import { TodayGameValidation } from '@/lib/validations/today';
import { type SimilarityStatusType, similarityStatus } from '@/utils/similarityUtils';

import TodayGameStatus from './TodayGameStatus';

const TodayGameHotDate = () => {
  const __ = useTranslations();
  const [status, setStatus] = useState<SimilarityStatusType | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const { checkAnswer } = useTodayGame();
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

  const buttonLabel = useMemo(
    () => (isXs ? __('!noun:send') : __('!noun:send-answer')),
    [__, isXs],
  );

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

          <Button type="submit" variant="primary" disabled={!watchAnswer}>
            {buttonLabel}
          </Button>
        </form>
      </Form>

      {status ? <TodayGameStatus status={status} /> : null}

      <div className="rounded-lg bg-gray-900/40 p-4"></div>
    </div>
  );
};

export default TodayGameHotDate;
