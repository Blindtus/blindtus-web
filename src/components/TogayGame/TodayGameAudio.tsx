import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import JSConfetti from 'js-confetti';
import { PlayCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import AnswerCardList from '@/components/AnswerCards/AnswerCardList';
import Loader from '@/components/Loader/Loader';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTodayGame } from '@/context/TodayGameContext';
import useViewport from '@/hooks/use-viewport';
import { TodayGameValidation } from '@/lib/validations/today';
import { isMobileDevice } from '@/utils/deviceUtils';
import { type SimilarityStatusType, similarityStatus } from '@/utils/similarityUtils';

import TodayGameStatus from './TodayGameStatus';

const TIMERS = [5, 10, 20, 40, 60];
const INTERVAL_PROGRESS = 100;

const TodayGameAudio = () => {
  const __ = useTranslations();
  const [startLoading, setStartLoading] = useState(false);
  const [answerSent, setAnswerSent] = useState<boolean | null>(null);
  const [status, setStatus] = useState<SimilarityStatusType | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const { currentStep, isCompleted, music, checkAnswer, isLoading, media, category } =
    useTodayGame();
  const audioRef = useRef<HTMLAudioElement>(null);

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
        audioRef.current?.pause();
        setProgress(null);
        const answerStatus = checkAnswer?.(data.answer) || similarityStatus.WRONG;
        const isCorrect = answerStatus === similarityStatus.CORRECT;
        setIsAnswerCorrect(isCorrect);
        setStatus(answerStatus);
        setAnswerSent(true);
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

  const handleAudioLoaded = useCallback(() => {
    setIsAudioLoaded(true);
  }, []);

  const handleLoadMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.load();
      setStartLoading(true);
    }
  }, []);

  const isAudioPlaying = useMemo(() => {
    return timerStarted;
  }, [timerStarted]);

  const handleNextRound = useCallback(() => {
    const audioPlayer = audioRef.current;

    if (!audioPlayer) {
      return;
    }

    audioPlayer.currentTime = 0;
    audioPlayer.play();
    setProgress(0);
    setTimerStarted(true);
  }, []);

  const handlePlaySong = useCallback(() => {
    if (!audioRef.current) {
      return;
    }

    if (answerSent === false) {
      if (watchAnswer) {
        onSubmit({ answer: watchAnswer });
      } else {
        onSubmit({ answer: '' });
      }
    }

    setAnswerSent(false);
    handleNextRound();
  }, [answerSent, handleNextRound, onSubmit, watchAnswer]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timerStarted) {
      const durationInSeconds = TIMERS[currentStep];

      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress === null) {
            clearInterval(interval);
            return durationInSeconds;
          }

          const nextProgress = prevProgress + 0.1; // Increment by 0.1 seconds (100ms)

          if (nextProgress >= durationInSeconds) {
            clearInterval(interval);
            const audioPlayer = audioRef.current;

            if (audioPlayer) {
              audioPlayer.pause();
            }

            setTimerStarted(false);

            return durationInSeconds;
          }
          return nextProgress;
        });
      }, INTERVAL_PROGRESS);
    }

    return () => clearInterval(interval);
  }, [currentStep, timerStarted]);

  const buttonLabel = useMemo(() => {
    if (watchAnswer !== '') {
      return isXs ? __('!noun:send') : __('!noun:send-answer');
    }

    return __('!noun:skip');
  }, [isXs, watchAnswer, __]);

  const buttonRender = useMemo(() => {
    return (
      <Button
        size="lg"
        onClick={isMobileDevice() && !isAudioLoaded ? handleLoadMusic : handlePlaySong}
        disabled={
          !music ||
          (!isMobileDevice() && !isAudioLoaded) ||
          (isMobileDevice() && startLoading && !isAudioLoaded)
        }
        className="w-full sm:w-auto"
      >
        {isMobileDevice() && !isAudioLoaded ? (
          __('!noun:load-song')
        ) : isAudioLoaded ? (
          <>
            <PlayCircle className="mr-2" /> {__('!noun:play-song')}
          </>
        ) : (
          <Loader />
        )}
      </Button>
    );
  }, [__, handleLoadMusic, handlePlaySong, isAudioLoaded, music, startLoading]);

  return (
    <div className="flex flex-col gap-4">
      {!isCompleted ? <ProgressBar value={progress} limit={TIMERS[currentStep]} /> : null}
      {music ? (
        <audio
          src={music.audioPath || ''}
          ref={audioRef}
          onCanPlay={handleAudioLoaded}
          preload="auto"
        />
      ) : isLoading ? (
        <Loader />
      ) : (
        <div>{__('!error:no-audio')}</div>
      )}

      {currentStep === 4 && media && category?._id ? (
        <AnswerCardList media={media} onClick={checkAnswer} />
      ) : (
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

            <Button type="submit" variant={!!watchAnswer ? 'primary' : 'secondary'} size="lg">
              {buttonLabel}
            </Button>
          </form>
        </Form>
      )}

      {status ? <TodayGameStatus status={status} /> : null}

      <div>{!isAudioPlaying ? buttonRender : null}</div>
    </div>
  );
};

export default TodayGameAudio;
