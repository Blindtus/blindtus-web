import Image from 'next/image';
import React, { useMemo } from 'react';

import { actorDataUri, actorGuestDataUri, posterDataUri } from '@/constants/image';
import { cn } from '@/lib/utils';
import type { Cast } from '@/types/media.type';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type ActorProps = {
  className?: string;
  actor?: Cast;
  showCharacter?: boolean;
  isRow?: boolean;
  size?: 'small' | 'medium' | 'large';
  isGuess?: boolean;
};

const Actor = ({
  className = '',
  actor = { photo: '', name: '', character: '' },
  showCharacter,
  isRow,
  size = 'medium',
  isGuess = false,
}: ActorProps) => {
  const src = useMemo(() => {
    if (!actor.photo) {
      if (isGuess) {
        return actorGuestDataUri;
      }
      return actorDataUri;
    }

    return `https://image.tmdb.org/t/p/w500/${actor.photo}`;
  }, [actor.photo, isGuess]);

  const imageSize = useMemo(() => {
    switch (size) {
      case 'small':
        return { width: 48, height: 72 };
      case 'large':
        return { width: 192, height: 288 };
      case 'medium':
      default:
        return { width: 96, height: 144 };
    }
  }, [size]);

  return (
    <div
      className={cn('flex items-center', isRow ? 'flex-row gap-4' : 'flex-col gap-1', className)}
    >
      <Image
        src={src}
        alt={name ?? ''}
        className="rounded-lg"
        width={imageSize.width}
        height={imageSize.height}
        placeholder="blur"
        blurDataURL={posterDataUri}
      />

      <div className="flex max-w-full grow flex-col gap-1 overflow-hidden">
        <h3 className={cn('truncate', !isRow ? 'text-center' : null)}>{actor.name}</h3>
        {showCharacter ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className={cn('text-sm', !isRow ? 'text-center' : 'truncate')}>
                  {actor.character}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{actor.character}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </div>
    </div>
  );
};

export default Actor;
