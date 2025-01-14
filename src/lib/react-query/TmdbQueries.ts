import { useGenericQuery } from '@/hooks/use-generic-query';

import { getPopularMedias, getSearchedMedias } from '../api/tmdb';
import { QUERY_KEYS } from './queryKeys';

export const useGetSearchedMedias = ({
  query,
  type,
  page = 1,
}: {
  query: string;
  type: 'movie' | 'tv';
  page?: number;
}) => {
  const queryKey = [QUERY_KEYS.TMDB_SEARCH, query, type, page];

  return useGenericQuery(
    queryKey,
    () =>
      getSearchedMedias({
        query,
        type,
        page,
      }),
    {
      enabled: false,
    },
  );
};

export const useGetPopularMedias = ({
  type,
  page = 1,
  sortBy,
}: {
  type: 'movie' | 'tv';
  page?: number;
  sortBy: 'popularity.desc' | 'vote_average.desc';
}) => {
  const queryKey = [QUERY_KEYS.TMDB_SEARCH, type, page, sortBy];

  return useGenericQuery(
    queryKey,
    () =>
      getPopularMedias({
        type,
        page,
        sortBy,
      }),
    {
      enabled: false,
    },
  );
};
