'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { usePlausible } from 'next-plausible';

import { TODAY_CATEGORIES } from '@/constants/todayCategories';
import { incrementCompletedCount, incrementPlayCount, incrementWinCount } from '@/lib/api/analytic';
import { useGetToday } from '@/lib/react-query/TodayQueries';
import type { Music } from '@/types/audio.type';
import type { Category } from '@/types/category.type';
import type { Media } from '@/types/media.type';
import type { PixelatedImage } from '@/types/pixelatedImage.type';
import type { GameType } from '@/types/today.type';
import { getTodayHistoryByTodayId, saveTodayHistory } from '@/utils/historyUtils';
import {
  type SimilarityStatusType,
  TemperatureType,
  checkSimilarity,
  evaluateNumber,
  similarityStatus,
  temperatureTypes,
} from '@/utils/similarityUtils';

type TodayGameContextType = {
  isLoading: boolean;
  currentStep: number;
  isCorrect: boolean;
  isCompleted: boolean;
  answers: Array<string>;
  media?: Media;
  music?: Music;
  pixelus?: PixelatedImage;
  category?: Category;
  gameType?: GameType;
  checkAnswer?: (_answer: string, exact?: boolean) => SimilarityStatusType;
  checkReleaseDate?: (_answer: string) => TemperatureType;
};

export const TodayGameContext = createContext<TodayGameContextType>({
  isLoading: true,
  currentStep: 0,
  isCorrect: false,
  isCompleted: false,
  answers: [],
});

type TodayGameProviderProps = {
  children: ReactNode;
  gameType: GameType;
};

export const TodayGameProvider = ({ children, gameType }: TodayGameProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [answers, setAnswers] = useState<Array<string>>([]);
  const [media, setMedia] = useState<Media | undefined>(undefined);
  const [music, setMusic] = useState<Music | undefined>(undefined);
  const [category, setCategory] = useState<Category | undefined>(undefined);

  const plausible = usePlausible();

  const gameCategory = useMemo(
    () => TODAY_CATEGORIES.find((cat) => cat.id === gameType),
    [gameType],
  );
  const { data: todayGame } = useGetToday();

  const todayHistoryCardInfo = useMemo(() => {
    const userTodayHistory = getTodayHistoryByTodayId(todayGame?._id ?? '');
    return userTodayHistory?.[gameType];
  }, [gameType, todayGame?._id]);

  const pixelus = useMemo(() => todayGame?.pixelus, [todayGame?.pixelus]);

  useEffect(() => {
    if (!todayHistoryCardInfo) {
      return;
    }

    if (todayHistoryCardInfo) {
      const isCompleted = todayHistoryCardInfo.isCompleted;
      setCurrentStep(todayHistoryCardInfo.attempts.length - (isCompleted ? 1 : 0));
      setAnswers(todayHistoryCardInfo.attempts);
      setIsCorrect(todayHistoryCardInfo.isCorrect);
      setIsCompleted(isCompleted);
    }
  }, [todayHistoryCardInfo]);

  useEffect(() => {
    if (todayGame) {
      const media: Media =
        todayGame && 'media' in (todayGame?.[gameType] ?? {})
          ? (todayGame?.[gameType] as { media: Media }).media
          : (todayGame[gameType] as Media);

      setMedia(media);

      if (gameType === 'blindtus') {
        setMusic((todayGame[gameType] as Music) || undefined);
      }

      if (media.category) {
        setCategory(media.category);
      }
      setIsLoading(false);
    }
  }, [gameType, todayGame]);

  const titles = useMemo(
    () =>
      !!media?.title
        ? media.title
        : {
            en: '',
            fr: '',
          },
    [media],
  );

  const saveHistory = useCallback(
    async ({
      answer,
      status,
      temperature,
    }: {
      answer: string;
      status?: SimilarityStatusType;
      temperature?: TemperatureType;
    }) => {
      const isCorrect =
        status === similarityStatus.CORRECT || temperature === temperatureTypes.CORRECT;
      const isCompleted =
        (status && (status === similarityStatus.CORRECT || currentStep === 4)) ||
        temperature === temperatureTypes.CORRECT;

      saveTodayHistory(todayGame?._id ?? '', {
        type: gameType,
        attempts: [...answers, answer],
        isCompleted,
        isCorrect,
      });

      if (currentStep === 0) {
        await incrementPlayCount(gameType);
      }

      if (isCompleted) {
        await incrementCompletedCount(gameType);
        plausible(`todayCompleted_${gameType}`, {
          props: { attemps: currentStep + 1, isCorrect },
        });
      }

      if (isCorrect) {
        await incrementWinCount(gameType);
      }
    },
    [todayGame?._id, gameType, answers, currentStep, plausible],
  );

  const checkAnswer = useCallback(
    (answer: string, exact = false) => {
      setAnswers((prev) => [...prev, answer]);

      const correctAnswer = [titles.en, titles.fr, ...(media?.simpleTitles ?? [])];
      const status = checkSimilarity(answer, correctAnswer, exact);

      const statusCorrect = status === similarityStatus.CORRECT;

      setIsCorrect(statusCorrect);
      setIsCompleted(statusCorrect || currentStep === 4);

      if (!statusCorrect && currentStep <= 4) {
        setCurrentStep((prev) => prev + 1);
      }

      saveHistory({ answer, status });

      return status;
    },
    [currentStep, media?.simpleTitles, saveHistory, titles.en, titles.fr],
  );

  const checkReleaseDate = useCallback(
    (answer: string) => {
      setAnswers((prev) => [...prev, answer]);

      const correctAnswer = media?.releaseDate ?? '';
      const temperature = evaluateNumber(Number(answer), Number(correctAnswer));

      const statusCorrect = temperature === temperatureTypes.CORRECT;

      setIsCorrect(statusCorrect);
      setIsCompleted(statusCorrect);

      if (!statusCorrect && currentStep <= 4) {
        setCurrentStep((prev) => prev + 1);
      }

      saveHistory({ answer, temperature });

      return temperature;
    },
    [currentStep, media?.releaseDate, saveHistory],
  );

  const value = useMemo(
    () => ({
      isLoading,
      currentStep,
      isCorrect,
      isCompleted,
      answers,
      media,
      category,
      checkAnswer,
      checkReleaseDate,
      music,
      pixelus,
      gameType: gameCategory?.game,
    }),
    [
      isLoading,
      currentStep,
      isCorrect,
      isCompleted,
      answers,
      media,
      category,
      checkAnswer,
      checkReleaseDate,
      music,
      pixelus,
      gameCategory?.game,
    ],
  );

  return <TodayGameContext.Provider value={value}>{children}</TodayGameContext.Provider>;
};

export const useTodayGame = () => {
  return useContext(TodayGameContext);
};
