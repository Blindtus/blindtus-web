'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { ContentLayout } from '@/components/Admin/ContentLayout/ContentLayout';
import SearchMediaList from '@/components/Admin/MediaList/SearchMediaList';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAdminCategoryType } from '@/context/AdminCategoryContext';
import { useGetCategoryBySlug } from '@/lib/react-query/CategoryQueries';

const MediaAddPage = () => {
  const { categorySlug } = useParams<{
    categorySlug: string;
  }>();
  const { data: categoryData } = useGetCategoryBySlug(categorySlug);
  const { category, setCategory } = useAdminCategoryType();

  useEffect(() => {
    if (categoryData && categoryData._id !== category._id) {
      setCategory({ ...categoryData, labelLower: categoryData.label.toLowerCase() });
    }
  }, [category._id, categoryData, setCategory]);

  return (
    <ContentLayout title={`Add ${category?.labelLower}`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/admin/medias/${categorySlug}`}>{category.labelLower}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <SearchMediaList />
    </ContentLayout>
  );
};

export default MediaAddPage;
