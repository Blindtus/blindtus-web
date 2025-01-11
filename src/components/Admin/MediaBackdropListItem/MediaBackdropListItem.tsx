import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

type MediaBackdropListItemProps = {
  className?: string;
  src: string;
  isSelected?: boolean;
  onSelectImage?: () => void;
};

const MediaBackdropListItem = ({
  className = '',
  src,
  isSelected = false,
  onSelectImage,
}: MediaBackdropListItemProps) => {
  return (
    <div className={cn('mb-2 flex flex-col gap-4', className)}>
      <div className="relative cursor-pointer select-none" onClick={onSelectImage}>
        <Image
          key={src}
          src={`https://image.tmdb.org/t/p/w780${src}`}
          alt=""
          width={300}
          height={100}
        />
        {isSelected ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-emerald-300 opacity-50" />
        ) : null}
      </div>
    </div>
  );
};

export default MediaBackdropListItem;
