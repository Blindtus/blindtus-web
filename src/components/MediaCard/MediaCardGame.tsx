import React, { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import Loader from '@/components/Loader/Loader';
import Actor from '@/components/Media/Actor';
import MediaPoster from '@/components/Poster/MediaPoster';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTodayGame } from '@/context/TodayGameContext';
import useViewport from '@/hooks/use-viewport';
import { cn } from '@/lib/utils';
import { getCurrentLocale } from '@/utils/i18nUtils';

const CAST_LIMIT = 5;

type MediaCardGameProps = {
  className?: string;
};

const MediaCardGame = ({ className = '' }: MediaCardGameProps) => {
  const __ = useTranslations();
  const currentLocale = getCurrentLocale();
  const { isLessThanMd } = useViewport();
  const { media, gameType, pixelus } = useTodayGame();

  const mediaSubTitle = useMemo(() => {
    if (!media) {
      return null;
    }

    const { directors } = media;

    if ((directors?.length ?? 0) > 0) {
      return <>{directors?.join(', ')}</>;
    }

    return null;
  }, [media]);

  const posterUrl = useMemo(() => {
    return gameType === 'pixelus' ? pixelus?.referenceImage : media?.selectedPoster;
  }, [gameType, media?.selectedPoster, pixelus?.referenceImage]);

  const title = useMemo(() => {
    if (!media) {
      return null;
    }

    return media.title[currentLocale as keyof typeof media.title];
  }, [currentLocale, media]);

  const overview = useMemo(() => {
    if (!media) {
      return null;
    }

    return media.overview?.[currentLocale as keyof typeof media.overview];
  }, [currentLocale, media]);

  const genres = useMemo(() => {
    if (!media) {
      return [];
    }

    return (
      media.genresData?.map((genre) => genre[currentLocale as keyof typeof genre] as string) ?? []
    );
  }, [currentLocale, media]);

  if (!media) {
    return <LoaderContainer className={className} />;
  }

  return (
    <div className={cn('relative overflow-hidden rounded', className)}>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-cyan-500/80 to-pink-500/40"></div>
      <MediaCardBackground />

      <div className="relative z-[2] flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative h-auto w-full md:w-64">
            <MediaPoster
              title={title || ''}
              posterPath={posterUrl ?? ''}
              size="medium"
              rounded="small"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <MediaCardGenres genres={genres} className="hidden md:flex" />
            <h2 className="text-4xl font-semibold">{title}</h2>
            <div className="font-semibold">{media.releaseDate}</div>
            {mediaSubTitle ? <div className="text-sm">{mediaSubTitle}</div> : null}
            <h3 className="text-1xl mt-4 font-semibold">{__('!noun:overview')}</h3>
            <p className="mt-1 text-sm">{overview}</p>
          </div>
        </div>
        <MediaCardGenres genres={genres} className="md:hidden" />

        <div>
          <h3 className="text-xl font-semibold">{__('!noun:actors')}</h3>
          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-5">
            {media.casts.slice(0, CAST_LIMIT).map((cast, key) => (
              <Actor key={key} actor={cast} isRow={isLessThanMd} showCharacter />
            ))}
          </div>
          <MediaCardMusic />
        </div>
      </div>
    </div>
  );
};

const LoaderContainer = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-md bg-gradient-to-b from-cyan-500/80 to-primary-special/80',
      className,
    )}
  >
    <Loader />
  </div>
);

const MediaCardBackground = () => {
  const { media } = useTodayGame();
  if (!media) return null;

  return (
    <div
      className="absolute inset-0 block rounded-md bg-cover bg-scroll bg-top blur-lg"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/w780${media.selectedBackdrop})`,
        zIndex: 0,
      }}
    />
  );
};

const MediaCardGenres = ({
  className = '',
  genres = [],
}: {
  className?: string;
  genres: Array<string>;
}) => {
  return (
    <div className={cn('mb-2 flex items-center gap-2', className)}>
      {genres.map((genre) => (
        <Badge key={genre} className="truncate">
          {genre}
        </Badge>
      ))}
    </div>
  );
};

const MediaCardMusic = () => {
  const __ = useTranslations();
  const { media, music } = useTodayGame();
  if (!media || !music) {
    return null;
  }

  return (
    <>
      <Separator className="my-4 bg-white/20" />
      <h3 className="text-xl font-semibold">{__('!noun:music')}</h3>
      <div>{music.title}</div>
      <div className="text-sm">{music.author}</div>
    </>
  );
};

export default MediaCardGame;
