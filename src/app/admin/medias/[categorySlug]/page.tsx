'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo } from 'react';

import { parseAsFloat, parseAsString, useQueryStates } from 'nuqs';

import { ContentLayout } from '@/components/Admin/ContentLayout/ContentLayout';
import MediaCard from '@/components/Admin/MediaCard/MediaCard';
import FilterDropdown, { Item } from '@/components/Filter/FilterDropdown';
import Loader from '@/components/Loader/Loader';
import Pagination from '@/components/Pagination/Pagination';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useAdminCategoryType } from '@/context/AdminCategoryContext';
import { useGetCategoryBySlug } from '@/lib/react-query/CategoryQueries';
import { useGetAllMedias } from '@/lib/react-query/MediaQueries';
import { stringToBoolean } from '@/utils/stringUtils';

const MediasPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { category, setSlug } = useAdminCategoryType();
  const [filter, setFilter] = useQueryStates({
    title: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
    verified: parseAsString.withDefault('undefined'),
    year: parseAsString.withDefault(''),
    yearOperator: parseAsString.withDefault('$eq'),
    audiosCount: parseAsString.withDefault(''),
    audiosCountOperator: parseAsString.withDefault('$eq'),
    postersCount: parseAsString.withDefault(''),
    postersCountOperator: parseAsString.withDefault('$eq'),
  });

  const [pagination, setPagination] = useQueryStates(
    {
      pageIndex: parseAsFloat.withDefault(1),
      pageSize: parseAsFloat.withDefault(10),
    },
    {
      history: 'push',
    },
  );

  const { data: categoryData, isFetching: isFetchingMediaType } =
    useGetCategoryBySlug(categorySlug);

  const { data: medias, isFetching: isFetchingMedias } = useGetAllMedias({
    category: categorySlug ?? '',
    skip: (pagination.pageIndex - 1) * pagination.pageSize,
    limit: pagination.pageSize,
    filter: {
      ...filter,
      verified: stringToBoolean(filter.verified),
      year: {
        operator: filter.yearOperator,
        value: Number(filter.year) || undefined,
      },
      audiosCount: {
        operator: filter.audiosCountOperator,
        value: filter.audiosCount ? Number(filter.audiosCount) : undefined,
      },
      postersCount: {
        operator: filter.postersCountOperator,
        value: filter.postersCount ? Number(filter.postersCount) : undefined,
      },
    },
  });

  const isLoading = useMemo(
    () => isFetchingMediaType || isFetchingMedias,
    [isFetchingMediaType, isFetchingMedias],
  );

  useEffect(() => {
    setSlug(categorySlug);
  }, [categorySlug, setSlug]);

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination({ pageIndex: page });
    },
    [setPagination],
  );

  const handleApplyFilter = useCallback(
    (newFilter: { item: Item; value: string | number; operator?: string }) => {
      setFilter({
        [newFilter.item.value]: newFilter.value.toString(),
        [`${newFilter.item.value}Operator`]: newFilter.operator,
      });
    },
    [setFilter],
  );

  const datas = useMemo(() => medias?.data ?? [], [medias]);

  if (!categoryData) {
    return <Loader />;
  }

  return (
    <ContentLayout title={`Medias - ${category.labelLower}`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{category.labelLower}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-4 flex flex-col flex-wrap justify-between gap-4 lg:flex-row">
        <div className="flex justify-between gap-2 sm:justify-normal">
          <Button asChild className="flex-auto sm:flex-initial">
            <Link href={`/admin/medias/${category.slug}/add`}>Add new {category.labelLower}</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2">
        {filter.title ? (
          <Button variant="outline" onClick={() => setFilter({ title: '' })}>
            {filter.title} <span className="text-accent-foreground">x</span>
          </Button>
        ) : null}

        {filter.year ? (
          <Button variant="outline" onClick={() => setFilter({ year: '', yearOperator: '' })}>
            {filter.year} - {filter.yearOperator} <span className="text-accent-foreground">x</span>
          </Button>
        ) : null}

        {stringToBoolean(filter.verified) !== undefined ? (
          <Button variant="outline" onClick={() => setFilter({ verified: 'undefined' })}>
            {stringToBoolean(filter.verified) ? 'Verified' : 'Not verified'}{' '}
            <span className="text-accent-foreground">x</span>
          </Button>
        ) : null}

        {filter.audiosCount !== '' ? (
          <Button
            variant="outline"
            onClick={() => setFilter({ audiosCount: '', audiosCountOperator: '$eq' })}
          >
            {filter.audiosCount} - {filter.audiosCountOperator}{' '}
            <span className="text-accent-foreground">x</span>
          </Button>
        ) : null}

        {filter.postersCount !== '' ? (
          <Button
            variant="outline"
            onClick={() => setFilter({ postersCount: '', postersCountOperator: '$eq' })}
          >
            {filter.postersCount} - {filter.postersCountOperator}{' '}
            <span className="text-accent-foreground">x</span>
          </Button>
        ) : null}

        <FilterDropdown
          onApply={handleApplyFilter}
          label="Add filter"
          items={[
            { label: 'Title', value: 'title', type: 'text' },
            { label: 'Verified', value: 'verified', type: 'boolean' },
            { label: 'Year', value: 'year', type: 'number' },
            { label: 'Nbr audios', value: 'audiosCount', type: 'number' },
            { label: 'Nbr posters', value: 'postersCount', type: 'number' },
          ]}
        />
      </div>

      <div className="mt-8">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-2 divide-y">
            {datas.map((media) => (
              <MediaCard
                key={media._id}
                media={media}
                category={{
                  _id: categoryData?._id ?? '',
                  slug: categoryData?.slug ?? '',
                }}
              />
            ))}

            <Pagination
              className="py-8"
              count={medias?.count ?? 0}
              page={pagination.pageIndex}
              limit={pagination.pageSize}
              totalPages={medias?.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </ContentLayout>
  );
};

export default MediasPage;
