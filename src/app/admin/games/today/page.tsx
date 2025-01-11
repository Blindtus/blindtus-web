'use client';

import React, { useCallback } from 'react';

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
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useGenerateTodayGame, useGetAllToday } from '@/lib/react-query/TodayQueries';
import type { Today } from '@/types/today.type';

import { columns } from './columns';

const GameTodayPage = () => {
  const [pagination, setPagination] = useQueryStates(
    {
      pageIndex: parseAsFloat.withDefault(1),
      pageSize: parseAsFloat.withDefault(10),
    },
    {
      history: 'push',
    },
  );

  const { data: today, isFetching: isTodaysFetching } = useGetAllToday({
    skip: (pagination.pageIndex - 1) * pagination.pageSize,
    limit: pagination.pageSize,
  });

  const { mutateAsync: generateTodayGame, isPending } = useGenerateTodayGame();

  const handleGenerateTodayGame = useCallback(async () => {
    try {
      await generateTodayGame({});

      toast({
        title: 'Today game has been generated',
      });
    } catch (error) {
      toast({
        title: (error as Error).message,
        variant: 'destructive',
      });
      console.error(error);
    }
  }, [generateTodayGame]);

  return (
    <ContentLayout title="Today game">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Today game</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-end">
        <Button onClick={handleGenerateTodayGame} disabled={isPending}>
          {isPending ? <Loader /> : 'Generate today'}
        </Button>
      </div>

      {isTodaysFetching ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          data={today?.data as unknown as Today[]}
          showPagination
          totalItems={today?.count || 0}
          pageIndex={pagination.pageIndex - 1}
          pageSize={pagination.pageSize}
          totalPage={today?.totalPages || 0}
          onPageChange={(pageIndex) => setPagination({ pageIndex: pageIndex + 1 })}
          onLimitChange={(pageSize) => setPagination({ pageSize })}
        />
      )}
    </ContentLayout>
  );
};

export default GameTodayPage;
