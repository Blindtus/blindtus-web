import React, { useMemo } from 'react';

import { cn } from '@/lib/utils';
import type { Media } from '@/types/media.type';
import { getCurrentLocale } from '@/utils/i18nUtils';

type AnswerCardProps = {
  className?: string;
  media: Media;
  onClick: (_answer: string) => void;
  onHover?: () => void;
  onLeave?: () => void;
  isHovered?: boolean;
  isGrayscale: boolean;
};

const AnswerCard = ({
  className = '',
  media,
  onClick,
  onHover,
  onLeave,
  isGrayscale,
}: AnswerCardProps) => {
  const currentLocale = getCurrentLocale();

  const title = useMemo(() => {
    const titles: { [key: string]: string } = media.title;
    return titles[currentLocale];
  }, [currentLocale, media.title]);

  return (
    <div
      className={cn(
        'relative flex h-24 w-full cursor-pointer select-none items-center justify-center rounded bg-cover bg-center transition-all duration-300 active:scale-95',
        isGrayscale ? 'grayscale' : '',
        className,
      )}
      style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w780${media.selectedBackdrop})` }}
      onClick={() => onClick(title)}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className={cn(
          'absolute left-0 top-0 h-full w-full rounded bg-gradient-to-r from-cyan-500/80 to-pink-500/40',
        )}
      ></div>
      <span className="relative z-10 truncate px-2 text-2xl font-semibold text-white shadow-black drop-shadow-lg">
        {title}
      </span>
    </div>
  );
};

export default AnswerCard;
