'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ContentLayout } from '@/components/Admin/ContentLayout/ContentLayout';
import MediaDetail from '@/components/Admin/MediaDetail/MediaDetail';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAdminCategoryType } from '@/context/AdminCategoryContext';

const MediaDetailPage = () => {
  const { mediaId, categorySlug, mediaSlug } = useParams<{
    mediaId: string;
    categorySlug: string;
    mediaSlug: string;
  }>();
  const { category } = useAdminCategoryType();

  return (
    <ContentLayout title={mediaId}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/admin/medias/${categorySlug}`}>{category.labelLower}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{mediaSlug}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <MediaDetail mediaId={mediaId} />
    </ContentLayout>
  );
};

export default MediaDetailPage;
