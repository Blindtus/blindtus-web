'use client';

import Link from 'next/link';
import { useCallback, useMemo } from 'react';

import { ArrowRight, ThermometerIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import ListAnswer from '@/components/Answer/ListAnswer';
import Clues from '@/components/Clues/Clues';
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/Credenza/Credenza';
import MediaCardGame from '@/components/MediaCard/MediaCardGame';
import Steps from '@/components/Steps/Steps';
import { Button } from '@/components/ui/button';
import { AudioContextProvider } from '@/context/AudioContext';
import { useTodayGame } from '@/context/TodayGameContext';
import { cn } from '@/lib/utils';
import { LocalMediaType } from '@/types/category.type';
import { GameTypes } from '@/types/today.type';
import { getTodayNextCategory } from '@/utils/gameUtils';
import { getCurrentLocale } from '@/utils/i18nUtils';
import { evaluateNumber } from '@/utils/similarityUtils';

import ListAnswerTemperature from '../Answer/ListAnswerTemperature';
import VolumeSlider from '../VolumeSlider/VolumeSlider';
import TodayGameAudio from './TodayGameAudio';
import TodayGameCastus from './TodayGameCastus';
import TodayGameHotDate from './TodayGameHotDate';
import TodayGamePixelus from './TodayGamePixelus';
import TodayGameTitleTwist from './TodayGameTitleTwist';

const STEPS = [0, 1, 2, 3, 4];

const TodayGame = () => {
  const __ = useTranslations();
  const currentLocale = getCurrentLocale();

  const { currentStep, isCorrect, isCompleted, answers, media, category, gameType } =
    useTodayGame();

  const renderGame = useCallback(() => {
    switch (gameType) {
      case 'blindtus':
        return <TodayGameAudio />;
      case 'pixelus':
        return <TodayGamePixelus />;
      case 'castus':
        return <TodayGameCastus />;
      case 'hotDate':
        return <TodayGameHotDate />;
      case 'titleTwist':
        return <TodayGameTitleTwist />;
      default:
        return null;
    }
  }, [gameType]);

  const renderNextCategory = useCallback(() => {
    if (!isCompleted) {
      return null;
    }

    if (!gameType) {
      return;
    }

    const nextCategory = getTodayNextCategory(gameType);

    if (!nextCategory) {
      return null;
    }

    // __('!text:redirectTodayGameWithCategory')
    return (
      <div className="mb-8">
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/today/${nextCategory.slug}`}>
            {__('!text:redirectTodayGameWithCategory', {
              category: nextCategory.label[currentLocale],
            })}

            <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
      </div>
    );
  }, [__, currentLocale, gameType, isCompleted]);

  // __('!noun:movie')
  // __('!noun:tv')
  const renderMediaType = useMemo(() => {
    if (!category) {
      return null;
    }

    if (gameType === GameTypes.HOT_DATE) {
      return __('!text:lookingForReleaseDateMovie');
      // return 'the release date of the movie';
    }

    return `${__('!text:lookingForMediaType')} ${__(`!noun:${category?.type}`)}`;
  }, [__, category, gameType]);

  const lastAnswer = useMemo(() => {
    const answer = answers.findLast((answer) => answer);

    if (gameType === GameTypes.HOT_DATE) {
      const temperature =
        answer && media?.releaseDate !== undefined
          ? evaluateNumber(media.releaseDate, Number(answer))
          : 'cold';
      return (
        <div className="flex items-center gap-2">
          <ThermometerIcon
            className={cn('h-10 w-6', {
              'text-blue-500': temperature === 'cold',
              'text-yellow-500': temperature === 'warm',
              'text-red-500': temperature === 'hot',
              'text-green-500': temperature === 'correct',
            })}
          />

          <span className="flex-1 truncate">{answer}</span>
        </div>
      );
    }

    return answer;
  }, [answers, gameType, media?.releaseDate]);

  return (
    <AudioContextProvider>
      <div className="pb-12">
        {renderMediaType ? <div className="mb-4 text-xl">{renderMediaType}</div> : null}

        {renderNextCategory()}

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-8 gap-8">
            <div className="col-span-8 flex flex-col gap-4 sm:col-span-5 xl:col-span-6">
              <Steps steps={STEPS} active={currentStep} isCorrect={isCorrect} />
              {!isCompleted ? (
                renderGame()
              ) : (
                <div>
                  <MediaCardGame />
                </div>
              )}

              {!isCompleted && media && gameType === 'blindtus' ? (
                <Clues
                  media={media}
                  mediaType={category?.slug as LocalMediaType}
                  currentStep={currentStep}
                />
              ) : null}
            </div>

            <div className="hidden flex-col gap-8 sm:col-span-3 sm:flex xl:col-span-2">
              {gameType === GameTypes.BLINDTUS ? <VolumeSlider className="-mt-8" /> : null}
              {gameType === GameTypes.HOT_DATE ? (
                <ListAnswerTemperature answers={answers} refAnswer={media?.releaseDate} />
              ) : (
                <ListAnswer answers={answers} isCorrect={isCorrect} />
              )}
            </div>
          </div>

          <Credenza>
            <CredenzaTrigger asChild className="fixed inset-x-4 bottom-4 z-40 sm:hidden">
              <div
                className={cn(
                  'flex items-center gap-4 rounded border bg-slate-900 p-2',
                  isCorrect ? 'border-emerald-400' : 'border-pink-500',
                  !answers.length ? 'border-slate-800' : null,
                )}
              >
                <div className="flex flex-1 flex-col overflow-hidden rounded-md font-medium disabled:pointer-events-none disabled:opacity-50">
                  <div className="text-sm">
                    {answers.length === 0 ? __('!text:no-try') : __('!text:last-try')}
                  </div>
                  <div className="truncate">{lastAnswer || __('!noun:empty')}</div>
                </div>
                <Button variant="secondary">{__('!noun:show')}</Button>
              </div>
            </CredenzaTrigger>
            <CredenzaContent>
              <CredenzaHeader>
                <CredenzaTitle>{__('!noun:your-answers')}</CredenzaTitle>
              </CredenzaHeader>
              <CredenzaBody>
                {gameType === GameTypes.HOT_DATE ? (
                  <ListAnswerTemperature
                    answers={answers}
                    refAnswer={media?.releaseDate}
                    noAnimation
                    hideTitle
                  />
                ) : (
                  <ListAnswer answers={answers} isCorrect={isCorrect} noAnimation hideTitle />
                )}
              </CredenzaBody>
              <CredenzaFooter>
                <CredenzaClose asChild>
                  <button>{__('!noun:close')}</button>
                </CredenzaClose>
              </CredenzaFooter>
            </CredenzaContent>
          </Credenza>
        </div>
      </div>
    </AudioContextProvider>
  );
};

export default TodayGame;
