import Image from 'next/image';

import { VariantProps, cva } from 'class-variance-authority';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { posterDataUri } from '@/constants/image';
import { cn } from '@/lib/utils';

const posterSizes = {
  small: {
    width: 96,
    height: 144,
  },
  medium: {
    width: 207,
    height: 311,
  },
  large: {
    width: 300,
    height: 450,
  },
};

const posterVariants = cva('size-full object-cover', {
  variants: {
    rounded: {
      default: 'rounded-lg',
      small: 'rounded',
    },
  },
  defaultVariants: {
    rounded: 'default',
  },
});

type MediaPosterProps = VariantProps<typeof posterVariants> & {
  className?: string;
  title?: string;
  posterPath?: string;
  size?: 'small' | 'medium' | 'large';
  withoutUrlPrefix?: boolean;
};

const MediaPoster = ({
  className = '',
  title = '',
  posterPath,
  size = 'small',
  withoutUrlPrefix = false,
  rounded = 'default',
}: MediaPosterProps) => {
  const { width, height } = posterSizes[size];

  const imageUrl = withoutUrlPrefix ? posterPath : `https://image.tmdb.org/t/p/w500${posterPath}`;

  return (
    <AspectRatio ratio={2 / 3} className={className}>
      <Image
        src={imageUrl ?? posterDataUri}
        alt={title}
        className={cn(posterVariants({ rounded }), 'size-full object-cover shadow')}
        width={width}
        height={height}
        placeholder="blur"
        blurDataURL={posterDataUri}
      />
    </AspectRatio>
  );
};

export default MediaPoster;
