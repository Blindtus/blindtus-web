import { QueryResponse } from '@/types/query.type';
import { TMDBSearchMedia } from '@/types/tmdb.type';
import { callApi } from '@/utils/apiUtils';

export const getSearchedMedias = async ({
  query,
  type,
  page = 1,
}: {
  query: string;
  type: 'movie' | 'tv';
  page?: number;
}) => {
  try {
    const queryParams = new URLSearchParams({
      query,
      type,
      page: page.toString(),
    });

    const response: QueryResponse<TMDBSearchMedia[]> = await callApi({
      endpoint: `/admin/tmdb/search?${queryParams.toString()}`,
      method: 'GET',
    });

    return response;
  } catch (error) {
    console.error('Failed to fetch searched medias', error);
    return null;
  }
};

export const getPopularMedias = async ({
  type,
  page,
  sortBy,
}: {
  type: 'movie' | 'tv';
  page: number;
  sortBy: 'popularity.desc' | 'vote_average.desc';
}) => {
  try {
    const queryParams = new URLSearchParams({
      type,
      page: page.toString(),
      sortBy,
    });

    const response: QueryResponse<TMDBSearchMedia[]> = await callApi({
      endpoint: `/admin/tmdb/popular?${queryParams.toString()}`,
      method: 'GET',
    });

    return response;
  } catch (error) {
    console.error('Failed to fetch popular medias', error);
    return null;
  }
};

export const getSearchedMediasSuggest = async ({ query }: { query: string }) => {
  try {
    const queryParams = new URLSearchParams({
      query,
    });

    const response: QueryResponse<TMDBSearchMedia[]> = await callApi({
      endpoint: `/tmdb/suggest/search?${queryParams.toString()}`,
      method: 'GET',
    });

    return response;
  } catch (error) {
    console.error('Failed to fetch searched medias', error);
    return null;
  }
};
