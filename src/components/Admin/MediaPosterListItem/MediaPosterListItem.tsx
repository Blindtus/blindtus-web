import React, { useCallback, useMemo } from 'react';

import MediaPoster from '@/components/Poster/MediaPoster';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useGetMediaPixelatedImages } from '@/lib/react-query/MediaQueries';
import { useCreatePixelatedImage } from '@/lib/react-query/PixelatedImageQueries';
import { cn } from '@/lib/utils';

type MediaPosterListItemProps = {
  className?: string;
  src: string;
  mediaId: string;
  category: string;
  isSelected?: boolean;
  onSelectPoster?: () => void;
};

const MediaPosterListItem = ({
  className = '',
  src,
  isSelected = false,
  onSelectPoster,
  mediaId,
}: MediaPosterListItemProps) => {
  const { mutateAsync: createPixelatePosters, isPending } = useCreatePixelatedImage();
  const { data: pixelatedImages } = useGetMediaPixelatedImages(mediaId);

  const isAlreadyPixelated = useMemo(() => {
    return pixelatedImages?.some((pixelatedImage) => pixelatedImage.referenceImage === src);
  }, [pixelatedImages, src]);

  const handlePixelatePosters = useCallback(
    async (poster: string) => {
      try {
        await createPixelatePosters({
          image: poster,
          mediaId,
        });
      } catch (error) {
        console.error(error);
        if ((error as { code?: number })?.code === 409) {
          toast({
            title: "You've already pixelated this poster",
            variant: 'destructive',
          });
        }
      }
    },
    [createPixelatePosters, mediaId],
  );

  return (
    <div className={cn('mb-2 flex flex-col gap-4', className)}>
      <div className="relative cursor-pointer select-none" onClick={onSelectPoster}>
        <MediaPoster posterPath={src} size="medium" />
        {isSelected ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-emerald-300 opacity-50" />
        ) : null}
      </div>
      <Button
        className="w-full"
        onClick={() => handlePixelatePosters(src)}
        disabled={isPending || isAlreadyPixelated}
      >
        {isPending ? 'Pixelating...' : isAlreadyPixelated ? 'Pixelated' : 'Pixelate'}
      </Button>
    </div>
  );
};

export default MediaPosterListItem;
