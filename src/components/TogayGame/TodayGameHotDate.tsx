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
import { temperatureTypes } from '@/utils/similarityUtils';

const TodayGameHotDate = () => {
  const __ = useTranslations();
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const { checkReleaseDate, media } = useTodayGame();
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
        const answerStatus = checkReleaseDate?.(data.answer) || temperatureTypes.COLD;
        const isCorrect = answerStatus === temperatureTypes.CORRECT;
        setIsAnswerCorrect(isCorrect);
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
    [checkReleaseDate, form],
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
                  <Input
                    type="number"
                    min={1900}
                    {...field}
                    isWiggle={isAnswerCorrect === false}
                    placeholder="1994"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" variant="primary" disabled={!watchAnswer}>
            {buttonLabel}
          </Button>
        </form>
      </Form>

      <div className="w-full max-w-full md:w-96">
        <MediaPoster title="Find the media" posterPath={media?.selectedPoster} size="medium" />
      </div>
    </div>
  );
};

export default TodayGameHotDate;
