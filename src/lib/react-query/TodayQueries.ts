import { useQueryClient } from '@tanstack/react-query';

import { useGenericMutation, useGenericQuery } from '@/hooks/use-generic-query';
import { QueryResponse } from '@/types/query.type';
import { Today } from '@/types/today.type';

import {
  deleteToday,
  generateTodayGame,
  getAllToday,
  getToday,
  getTodayById,
  regenerateTodayGame,
} from '../api/today';
import { QUERY_KEYS } from './queryKeys';

export const useGetAllToday = ({ skip, limit }: { skip: number; limit: number }) => {
  const queryKey = [QUERY_KEYS.TODAY_ALL, skip, limit];

  return useGenericQuery(queryKey, () =>
    getAllToday({
      skip,
      limit,
    }),
  );
};

export const useGetToday = () => useGenericQuery([QUERY_KEYS.TODAY], getToday);

export const useGetTodayById = (todayId: string) =>
  useGenericQuery([QUERY_KEYS.TODAY_BY_ID, todayId], () => getTodayById(todayId), {
    enabled: !!todayId,
  });

export const useGenerateTodayGame = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<unknown, QueryResponse<Today>>(
    generateTodayGame,
    (response) => {
      const originalData = queryClient.getQueryData<Today[]>([QUERY_KEYS.TODAY_ALL]);

      queryClient.setQueryData(
        [QUERY_KEYS.TODAY_ALL],
        [...(originalData || []), ...(response.data ? [response.data] : [])],
      );
    },
    () => [QUERY_KEYS.TODAY_ALL],
  );
};

export const useRegenerateTodayGame = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<
    {
      todayId: string;
      blindtus?: boolean;
      pixelus?: boolean;
      castus?: boolean;
      hotDate?: boolean;
      titleTwist?: boolean;
    },
    QueryResponse<Today>
  >(
    ({ todayId, blindtus, pixelus, castus, hotDate, titleTwist }) =>
      regenerateTodayGame(todayId, {
        blindtus,
        pixelus,
        castus,
        hotDate,
        titleTwist,
      }),
    (response, { todayId }) => {
      const originalData = queryClient.getQueryData<Today[]>([QUERY_KEYS.TODAY_BY_ID, todayId]);

      queryClient.setQueryData([QUERY_KEYS.TODAY_BY_ID, todayId], response.data || originalData);
    },
    () => [QUERY_KEYS.TODAY_ALL],
  );
};

export const useDeleteToday = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<string, QueryResponse<Today>>(
    deleteToday,
    (response, todayId) => {
      const originalData = queryClient.getQueryData<Today[]>([QUERY_KEYS.TODAY_ALL]);

      if (!originalData) return;

      queryClient.setQueryData(
        [QUERY_KEYS.TODAY_ALL],
        originalData.filter((today) => today._id !== todayId),
      );
    },
    () => [QUERY_KEYS.TODAY_ALL],
  );
};
