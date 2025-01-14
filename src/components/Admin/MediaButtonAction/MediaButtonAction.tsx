'use client';

import React, { useCallback, useMemo } from 'react';

import { Plus, Trash } from 'lucide-react';

import Loader from '@/components/Loader/Loader';
import { Button } from '@/components/ui/button';
import { useAddMedia, useDeleteMedia, useGetAllMediaIds } from '@/lib/react-query/MediaQueries';

type MediaButtonActionProps = {
  mediaId: number;
  categoryId: string;
};

const MediaButtonAction = ({ mediaId, categoryId }: MediaButtonActionProps) => {
  const { mutateAsync: addMedia, isPending: isLoadingAddMedia } = useAddMedia();
  const { mutateAsync: removeMedia, isPending: isLoadingRemoveMedia } = useDeleteMedia();
  const { data: mediaIds, isFetching } = useGetAllMediaIds();

  const matchingMedia = useMemo(() => {
    return mediaIds?.find((item) => item.tmdbId?.toString() === mediaId.toString());
  }, [mediaIds, mediaId]);

  const isAlreadyAdded = useMemo(() => {
    return !!matchingMedia;
  }, [matchingMedia]);

  const handleMediaAction = useCallback(async () => {
    try {
      if (isAlreadyAdded && matchingMedia?._id) {
        await removeMedia(matchingMedia._id);
        return;
      }

      await addMedia({
        mediaId: mediaId.toString(),
        categoryId: categoryId,
      });
    } catch (error) {
      console.error(error);
    }
  }, [addMedia, categoryId, isAlreadyAdded, matchingMedia?._id, mediaId, removeMedia]);

  const buttonLabel = useMemo(() => {
    if (isAlreadyAdded) {
      return (
        <>
          <Trash size={16} className="mr-2" />
          Remove
        </>
      );
    }

    return (
      <>
        <Plus size={16} className="mr-2" />
        Add
      </>
    );
  }, [isAlreadyAdded]);

  return (
    <div>
      <Button onClick={handleMediaAction} variant={isAlreadyAdded ? 'secondary' : 'primary'}>
        {isLoadingAddMedia || isFetching || isLoadingRemoveMedia ? <Loader /> : buttonLabel}
      </Button>
    </div>
  );
};

export default MediaButtonAction;
