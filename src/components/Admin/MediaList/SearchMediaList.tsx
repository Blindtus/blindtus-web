'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { parseAsFloat, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';

import MediaCardSearch from '@/components/Admin/MediaCard/MediaCardSearch';
import Loader from '@/components/Loader/Loader';
import Pagination from '@/components/Pagination/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminCategoryType } from '@/context/AdminCategoryContext';
import { useGetPopularMedias, useGetSearchedMedias } from '@/lib/react-query/TmdbQueries';
import { TMDBSearchMedia } from '@/types/tmdb.type';

enum SortBy {
  popularity = 'popularity.desc',
  voteAverage = 'vote_average.desc',
}

const SearchMediaList = () => {
  const { category } = useAdminCategoryType();
  const [query, setQuery] = useState('');

  const [filter, setFilter] = useQueryStates({
    page: parseAsFloat.withDefault(1),
    query: parseAsString.withDefault(''),
    sortBy: parseAsStringEnum<SortBy>(Object.values(SortBy)).withDefault(SortBy.voteAverage),
  });

  const {
    data: popularMedias,
    refetch: refetchPopular,
    isFetching: isFetchingPopular,
    isFetched: isFetchedPopular,
  } = useGetPopularMedias({
    type: category.type as 'movie' | 'tv',
    page: filter.page,
    sortBy: filter.sortBy,
  });

  const {
    data: searchedMedias,
    refetch: refetchSearch,
    isFetching: isFetchingSearch,
    isFetched: isFetchedSearch,
  } = useGetSearchedMedias({
    type: category.type as 'movie' | 'tv',
    ...filter,
  });

  useEffect(() => {
    if (filter.query) {
      setQuery(filter.query);
    }
  }, [filter.query]);

  const medias = useMemo(() => {
    return searchedMedias?.data || popularMedias?.data || [];
  }, [popularMedias, searchedMedias]);

  const isFetching = useMemo(
    () => isFetchingPopular || isFetchingSearch,
    [isFetchingPopular, isFetchingSearch],
  );

  const isFetched = useMemo(
    () => isFetchedPopular || isFetchedSearch,
    [isFetchedPopular, isFetchedSearch],
  );

  const totalPages = useMemo(
    () => (filter.query ? searchedMedias?.totalPages : popularMedias?.totalPages),
    [filter.query, popularMedias?.totalPages, searchedMedias?.totalPages],
  );

  const currentPage = useMemo(
    () => (filter.query ? searchedMedias?.page : popularMedias?.page),
    [filter.query, popularMedias?.page, searchedMedias?.page],
  );

  const count = useMemo(
    () => (filter.query ? searchedMedias?.count : popularMedias?.count),
    [filter.query, popularMedias?.count, searchedMedias?.count],
  );

  useEffect(() => {
    if (!category._id) {
      return;
    }

    if (!!filter.query) {
      refetchSearch();
    } else {
      refetchPopular();
    }
  }, [refetchPopular, refetchSearch, category._id, filter.query]);

  useEffect(() => {
    if (filter.page) {
      if (filter.query) {
        refetchSearch();
      } else {
        refetchPopular();
      }
    }
  }, [filter.page, filter.query, refetchPopular, refetchSearch]);

  const handleGetTopMovies = useCallback(() => {
    setFilter({ page: 1, query: '' });
    refetchPopular();
  }, [refetchPopular, setFilter]);

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFilter({ page: 1, query });
      refetchSearch();
    },
    [query, refetchSearch, setFilter],
  );

  return (
    <div className="h-full">
      <div className="mt-4 flex flex-col flex-wrap justify-between gap-4 lg:flex-row">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <Input
            defaultValue={filter.query}
            onChange={(e) => setFilter({ query: e.target.value })}
            placeholder={`Search ${category.labelLower}...`}
            className="input--sm"
          />
          <Button type="submit">Search</Button>
        </form>

        <div className="flex justify-between gap-2 sm:justify-normal">
          <Button
            variant="secondary"
            onClick={handleGetTopMovies}
            className="flex-auto sm:flex-initial"
          >
            Get top {category.labelLower}
          </Button>
        </div>
      </div>

      {isFetching ? (
        <div className="mt-8 flex-1">
          <Loader />
        </div>
      ) : (
        <div className="mt-8 flex-1 overflow-hidden">
          <ul>
            {medias.map((movie: TMDBSearchMedia) => (
              <li key={movie.id}>
                <MediaCardSearch media={movie} categoryId={category._id} showActions />
              </li>
            ))}
          </ul>

          {isFetched && (!medias || !medias?.length) ? (
            <div>No results found</div>
          ) : (
            <Pagination
              className="my-8"
              count={count ?? 0}
              page={currentPage ?? 1}
              totalPages={totalPages}
              onPageChange={(page) => setFilter({ page })}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchMediaList;
