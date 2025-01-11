'use client';

import React from 'react';

import { parseAsFloat, useQueryStates } from 'nuqs';

import { ContentLayout } from '@/components/Admin/ContentLayout/ContentLayout';
import DataTable from '@/components/DataTable';
import Loader from '@/components/Loader/Loader';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { useGetMusics } from '@/lib/react-query/MusicQueries';
import { Music } from '@/types/audio.type';

import { columns } from './columns';

const MusicsPage = () => {
  const [pagination, setPagination] = useQueryStates(
    {
      pageIndex: parseAsFloat.withDefault(1),
      pageSize: parseAsFloat.withDefault(10),
    },
    {
      history: 'push',
    },
  );

  const { data: musics, isFetching: isMusicsFetching } = useGetMusics({
    skip: (pagination.pageIndex - 1) * pagination.pageSize,
    limit: pagination.pageSize,
  });

  return (
    <ContentLayout title="Musics">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Musics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {isMusicsFetching ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          data={musics?.data as unknown as Music[]}
          showPagination
          totalItems={musics?.count || 0}
          pageIndex={pagination.pageIndex - 1}
          pageSize={pagination.pageSize}
          totalPage={musics?.totalPages || 0}
          onPageChange={(pageIndex) => setPagination({ pageIndex: pageIndex + 1 })}
          onLimitChange={(pageSize) => setPagination({ pageSize })}
        />
      )}
    </ContentLayout>
  );
};

export default MusicsPage;
