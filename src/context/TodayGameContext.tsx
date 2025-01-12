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
import { useGetToday } from '@/lib/react-query/TodayQueries';
import type { Music } from '@/types/audio.type';
import type { Category } from '@/types/category.type';
import type { Media } from '@/types/media.type';
import type { PixelatedImage } from '@/types/pixelatedImage.type';
import type { GameType } from '@/types/today.type';
import { getTodayHistoryByTodayId, saveTodayHistory } from '@/utils/historyUtils';
import {
  type SimilarityStatusType,
  checkSimilarity,
  similarityStatus,
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
  checkAnswer?: (_answer: string) => SimilarityStatusType;
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
        'media' in todayGame[gameType] ? (todayGame[gameType].media as Media) : todayGame[gameType];

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
    ({ answer, status }: { answer: string; status: SimilarityStatusType }) => {
      const isCorrect = status === similarityStatus.CORRECT;
      const isCompleted = status === similarityStatus.CORRECT || currentStep === 4;
      saveTodayHistory(todayGame?._id ?? '', {
        type: gameType,
        attempts: [...answers, answer],
        isCompleted,
        isCorrect,
      });

      if (isCompleted) {
        plausible(`todayCompleted_${gameType}`, {
          props: { attemps: currentStep + 1, isCorrect },
        });
      }
    },
    [todayGame?._id, gameType, answers, currentStep, plausible],
  );

  const checkAnswer = useCallback(
    (answer: string) => {
      setAnswers((prev) => [...prev, answer]);

      const correctAnswer = [titles.en, titles.fr, ...(media?.simpleTitles ?? [])];
      const status = checkSimilarity(answer, correctAnswer);

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
