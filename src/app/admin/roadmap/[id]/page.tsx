import Link from 'next/link';
import React from 'react';

import { ContentLayout } from '@/components/Admin/ContentLayout/ContentLayout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type RoadmapDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const RoadmapDetailPage = async ({ params }: RoadmapDetailPageProps) => {
  const { id } = await params;

  return (
    <ContentLayout title={`Roadmap - ${id}`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/roadmap">Roadmap</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <div className="mt-8 justify-between md:flex">
          <div>
            <h1 className="page-title--sm">Roadmap item</h1>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default RoadmapDetailPage;
