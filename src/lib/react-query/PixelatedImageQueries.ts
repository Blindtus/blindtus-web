import { useQueryClient } from '@tanstack/react-query';

import { useGenericMutation } from '@/hooks/use-generic-query';
import { PixelatedImage } from '@/types/pixelatedImage.type';
import { QueryResponse } from '@/types/query.type';

import { createPixelatedImages, deletePixelatedImages } from '../api/pixelatedImage';
import { QUERY_KEYS } from './queryKeys';

export const useCreatePixelatedImage = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<
    {
      image: string;
      mediaId: string;
    },
    QueryResponse<PixelatedImage>
  >(
    ({ image, mediaId }) => createPixelatedImages(image, mediaId),
    (response, { mediaId }) => {
      if (!response.data) return;

      const originalData = queryClient.getQueryData<PixelatedImage[]>([
        QUERY_KEYS.MEDIAS_PIXELATED_IMAGES,
        mediaId,
      ]);

      if (originalData) {
        queryClient.setQueryData(
          [QUERY_KEYS.MEDIAS_PIXELATED_IMAGES, mediaId],
          originalData.concat(response.data),
        );
      } else {
        queryClient.setQueryData([QUERY_KEYS.MEDIAS_PIXELATED_IMAGES, mediaId], [response.data]);
      }
    },
    () => [],
  );
};

export const useDeletePixelatedImage = () => {
  const queryClient = useQueryClient();
  return useGenericMutation<
    {
      pixelatedImageId: string;
      mediaId: string;
    },
    QueryResponse<PixelatedImage>
  >(
    ({ pixelatedImageId }) => deletePixelatedImages(pixelatedImageId),
    (response, { mediaId }) => {
      if (!response.data) return;

      const originalData = queryClient.getQueryData<PixelatedImage[]>([
        QUERY_KEYS.MEDIAS_PIXELATED_IMAGES,
        mediaId,
      ]);

      if (originalData) {
        queryClient.setQueryData(
          [QUERY_KEYS.MEDIAS_PIXELATED_IMAGES, mediaId],
          originalData.filter((data) => data._id !== response.data?._id),
        );
      }
    },
    () => [],
  );
};
