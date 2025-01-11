import Link from 'next/link';
import React from 'react';

import { ContentLayout } from '@/components/Admin/ContentLayout/ContentLayout';
import TodayDetail from '@/components/Admin/TodayDetail/TodayDetail';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type TodayDetailPageProps = {
  params: Promise<{
    todayId: string;
  }>;
};

const TodayDetailPage = async ({ params }: TodayDetailPageProps) => {
  const { todayId } = await params;

  return (
    <ContentLayout title={`Today game - ${todayId}`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/games/today">Today game</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{todayId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <TodayDetail todayId={todayId} />
    </ContentLayout>
  );
};

export default TodayDetailPage;
