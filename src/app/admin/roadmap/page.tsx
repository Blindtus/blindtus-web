'use client';

import Link from 'next/link';
import React from 'react';

import { PlusIcon } from 'lucide-react';

import { ContentLayout } from '@/components/Admin/ContentLayout/ContentLayout';
import DataTable from '@/components/DataTable';
import Loader from '@/components/Loader';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useGetRoadmapList } from '@/lib/react-query/RoadmapQueries';
import { Roadmap } from '@/types/roadmap.type';

import { columns } from './columns';

const RoadmapPage = () => {
  const { data: roadmap, isFetching: isFetchingRoadmap } = useGetRoadmapList();

  return (
    <ContentLayout title="Today game">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Roadmap</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/roadmap/add">
            <PlusIcon className="size-4" /> new roadmap item
          </Link>
        </Button>
      </div>

      {isFetchingRoadmap ? (
        <Loader />
      ) : (
        <DataTable columns={columns} data={roadmap?.data as unknown as Roadmap[]} />
      )}
    </ContentLayout>
  );
};

export default RoadmapPage;
