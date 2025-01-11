'use client';

import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useGetCategoryBySlug } from '@/lib/react-query/CategoryQueries';
import type { Category } from '@/types/category.type';

export type ContextCategory = Partial<Category> & {
  labelLower: string;
};

export type ContextType = {
  category: ContextCategory;
  setCategory: (_category: ContextCategory) => void;
  slug: string;
  setSlug: (_slug: string) => void;
};

const AdminCategoryContext = createContext<ContextType>({
  category: { label: '', labelFr: '', labelLower: '', slug: '' },
  setCategory: () => {},
  slug: '',
  setSlug: () => {},
});

type AdminCategoryProviderProps = {
  children: ReactNode;
  mediaSlug?: string;
};

export const AdminCategoryProvider = ({ children, mediaSlug = '' }: AdminCategoryProviderProps) => {
  const [slug, setSlug] = useState<string>(mediaSlug);

  const [category, setCategory] = useState<ContextCategory>({
    label: '',
    labelFr: '',
    labelLower: '',
    slug: '',
  });

  const { data } = useGetCategoryBySlug(slug);

  useEffect(() => {
    if (data) {
      setCategory({ ...data, labelLower: data.label.toLowerCase() });
    }
  }, [data]);

  const value = useMemo(
    () => ({
      category,
      setCategory,
      slug,
      setSlug,
    }),
    [category, slug],
  );

  return <AdminCategoryContext.Provider value={value}>{children}</AdminCategoryContext.Provider>;
};

export const useAdminCategoryType = () => {
  return useContext(AdminCategoryContext);
};
