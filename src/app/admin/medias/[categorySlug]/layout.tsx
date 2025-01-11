'use client';

import React from 'react';

import { useQueryState } from 'nuqs';

import { AdminCategoryProvider } from '@/context/AdminCategoryContext';

type MediaTypeLayoutProps = {
  children: React.ReactNode;
};

const MediaTypeLayout = ({ children }: MediaTypeLayoutProps) => {
  const [mediaTypeSlug] = useQueryState('mediaTypeSlug', {
    defaultValue: 'movies',
  });

  return <AdminCategoryProvider mediaSlug={mediaTypeSlug}>{children}</AdminCategoryProvider>;
};

export default MediaTypeLayout;
