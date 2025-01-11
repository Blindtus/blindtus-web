import React, { useCallback } from 'react';

import { Trash } from 'lucide-react';

import MediaPoster from '@/components/Poster/MediaPoster';
import { Button } from '@/components/ui/button';
import { useDeletePixelatedImage } from '@/lib/react-query/PixelatedImageQueries';
import { cn } from '@/lib/utils';
import { PixelatedImage } from '@/types/pixelatedImage.type';

type MediaPixelateListItemProps = {
  className?: string;
  pixelate: PixelatedImage;
  mediaId: string;
};

const MediaPixelateListItem = ({
  className = '',
  pixelate,
  mediaId,
}: MediaPixelateListItemProps) => {
  const { mutateAsync: deletePixelateImage, isPending } = useDeletePixelatedImage();

  const handleDeletePixelatePosters = useCallback(async () => {
    try {
      await deletePixelateImage({
        pixelatedImageId: pixelate._id,
        mediaId,
      });
    } catch (error) {
      console.error(error);
    }
  }, [deletePixelateImage, mediaId, pixelate]);

  return (
    <div className={cn(className)}>
      <div className="flex">
        <Button
          variant="destructive"
          className="mb-2 ml-auto"
          onClick={handleDeletePixelatePosters}
          disabled={isPending}
        >
          <Trash size={16} className="mr-2" />
          {isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 lg:grid-cols-6">
        <MediaPoster posterPath={pixelate.referenceImage} size="medium" />

        {pixelate.images.map((image) => (
          <MediaPoster key={image} posterPath={image} title="" size="medium" withoutUrlPrefix />
        ))}
      </div>
    </div>
  );
};

export default MediaPixelateListItem;
