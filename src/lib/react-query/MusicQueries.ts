import { useQueryClient } from '@tanstack/react-query';

import { useGenericMutation, useGenericQuery } from '@/hooks/use-generic-query';
import { Music, NewMusic } from '@/types/audio.type';
import { QueryResponse } from '@/types/query.type';

import { addMusic, deleteMusic, getAllMusic, updateMusic } from '../api/music';
import { QUERY_KEYS } from './queryKeys';

export const useGetMusics = ({ skip, limit }: { skip: number; limit: number }) => {
  const queryKey = [QUERY_KEYS.MUSICS_ALL, skip, limit];

  return useGenericQuery(queryKey, () =>
    getAllMusic({
      skip,
      limit,
    }),
  );
};

export const useAddMusic = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<NewMusic, QueryResponse<Music>>(
    addMusic,
    (response, { media }) => {
      const originalData = queryClient.getQueryData<Music[]>([QUERY_KEYS.MEDIAS_MUSICS, media]);

      queryClient.setQueryData(
        [QUERY_KEYS.MEDIAS_MUSICS, media],
        [...(originalData || []), ...(response.data ? [response.data] : [])],
      );
    },
    () => [QUERY_KEYS.MUSICS_ALL],
  );
};

export const useUpdateMusic = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<
    {
      musicId: string;
      music: Partial<Music>;
      mediaId: string;
    },
    QueryResponse<Music>
  >(
    ({ musicId, music }) => updateMusic(musicId, music),
    (response, { musicId, mediaId }) => {
      const originalData = queryClient.getQueryData<Music[]>([QUERY_KEYS.MEDIAS_MUSICS, mediaId]);

      const updatedData = originalData?.map((music) => {
        if (music._id === musicId) {
          return {
            ...music,
            ...response.data,
          };
        }

        return music;
      });

      queryClient.setQueryData([QUERY_KEYS.MEDIAS_MUSICS, mediaId], updatedData);
    },
    () => [QUERY_KEYS.MEDIAS_ALL],
  );
};

export const useDeleteMusic = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<string, QueryResponse<Music>>(
    deleteMusic,
    (response, musicId) => {
      const originalData = queryClient.getQueryData<Music[]>([
        QUERY_KEYS.MEDIAS_MUSICS,
        response.data?.media,
      ]);

      if (!originalData) return;

      queryClient.setQueryData(
        [QUERY_KEYS.MEDIAS_MUSICS, response.data?.media],
        originalData.filter((music) => music._id !== musicId),
      );
    },
    () => [QUERY_KEYS.MUSICS_ALL],
  );
};
