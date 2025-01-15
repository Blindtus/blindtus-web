import { useQueryClient } from '@tanstack/react-query';

import { useGenericMutation, useGenericQuery } from '@/hooks/use-generic-query';
import { Media } from '@/types/media.type';
import { QueryResponse } from '@/types/query.type';

import {
  addMedia,
  crawlMedia,
  deleteMedia,
  getAllMedias,
  getMediaById,
  getMediaIds,
  getMediaMusics,
  getMediaPixelatedImages,
  updateMedia,
} from '../api/media';
import { QUERY_KEYS } from './queryKeys';

export const useGetAllMedias = ({
  category,
  skip,
  limit,
  filter,
}: {
  category: string;
  skip: number;
  limit: number;
  filter?: {
    title?: string;
    status?: string;
    verified?: boolean;
    year?: {
      operator: string;
      value?: number;
    };
    audiosCount?: {
      operator: string;
      value?: number;
    };
    postersCount?: {
      operator: string;
      value?: number;
    };
  };
}) => {
  const queryFilter = JSON.stringify(filter);
  const queryKey = [QUERY_KEYS.MEDIAS_ALL, category, skip, limit, queryFilter];

  return useGenericQuery(
    queryKey,
    () =>
      getAllMedias({
        category,
        skip,
        limit,
        filter,
      }),
    {
      enabled: !!category,
    },
  );
};

export const useGetAllMediaIds = () => {
  return useGenericQuery([QUERY_KEYS.MEDIAS_ALL_IDS], () => getMediaIds());
};

export const useGetMedia = (mediaId: string) => {
  return useGenericQuery([QUERY_KEYS.MEDIAS_BY_ID, mediaId], () => getMediaById(mediaId));
};

export const useAddMedia = () => {
  return useGenericMutation<
    {
      mediaId: string;
      categoryId: string;
    },
    QueryResponse<Media>
  >(
    ({ mediaId, categoryId }) => addMedia(mediaId, categoryId),
    () => {},
    () => [QUERY_KEYS.MEDIAS_ALL_IDS, QUERY_KEYS.MEDIAS_ALL],
  );
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<
    {
      mediaId: string;
      media: Partial<Media>;
    },
    QueryResponse<Media>
  >(
    ({ mediaId, media }) => updateMedia(mediaId, media),
    (response, { mediaId }) => {
      const originalData = queryClient.getQueryData<Media>([QUERY_KEYS.MEDIAS_BY_ID, mediaId]);

      if (originalData) {
        queryClient.setQueryData([QUERY_KEYS.MEDIAS_BY_ID, mediaId], {
          ...originalData,
          ...response.data,
        });
      }

      const mediasDatas = queryClient.getQueriesData<QueryResponse<Media[]>>({
        queryKey: [QUERY_KEYS.MEDIAS_ALL],
      });

      mediasDatas.forEach((mediasData) => {
        if (!mediasData) {
          return;
        }

        const datas = mediasData[1]?.data || [];

        if (!datas) {
          return;
        }

        // update the media in the list
        const updatedMedias = datas.map((data) => {
          if (data._id === mediaId) {
            return {
              ...data,
              ...response.data,
            };
          }

          return data;
        });

        queryClient.setQueryData(mediasData[0], {
          ...mediasData[1],
          data: updatedMedias,
        });
      });
    },
    () => [],
  );
};

export const useDeleteMedia = () => {
  return useGenericMutation<string, QueryResponse<Media>>(
    deleteMedia,
    () => {},
    () => [QUERY_KEYS.MEDIAS_ALL, QUERY_KEYS.MEDIAS_ALL_IDS],
  );
};

export const useCrawlMedia = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<string, QueryResponse<Media>>(
    crawlMedia,
    (response, mediaId) => {
      const originalData = queryClient.getQueryData<Media>([QUERY_KEYS.MEDIAS_BY_ID, mediaId]);

      queryClient.setQueryData([QUERY_KEYS.MEDIAS_BY_ID, mediaId], {
        ...originalData,
        ...response.data,
      });
    },
    () => [QUERY_KEYS.MEDIAS_ALL],
  );
};

export const useGetMediaMusics = (mediaId: string) => {
  return useGenericQuery([QUERY_KEYS.MEDIAS_MUSICS, mediaId], () => getMediaMusics(mediaId));
};

export const useGetMediaPixelatedImages = (mediaId: string) => {
  return useGenericQuery([QUERY_KEYS.MEDIAS_PIXELATED_IMAGES, mediaId], () =>
    getMediaPixelatedImages(mediaId),
  );
};
