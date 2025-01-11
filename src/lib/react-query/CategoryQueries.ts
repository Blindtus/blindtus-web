import { useQueryClient } from '@tanstack/react-query';

import { useGenericMutation, useGenericQuery } from '@/hooks/use-generic-query';
import { Category, NewCategory } from '@/types/category.type';
import { QueryResponse } from '@/types/query.type';

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
} from '../api/category';
import { QUERY_KEYS } from './queryKeys';

export const useGetAllCategories = () =>
  useGenericQuery([QUERY_KEYS.CATEGORIES_ALL], getAllCategories);

export const useGetCategoryById = (id: string) =>
  useGenericQuery([QUERY_KEYS.CATEGORIES_BY_ID, id], () => getCategoryById(id), {
    enabled: !!id,
  });

export const useGetCategoryBySlug = (slug: string) =>
  useGenericQuery([QUERY_KEYS.CATEGORIES_BY_SLUG, slug], () => getCategoryBySlug(slug), {
    enabled: !!slug,
  });

export const useCreateCategory = () => {
  return useGenericMutation<NewCategory, QueryResponse<Category>>(
    createCategory,
    () => {},
    () => [QUERY_KEYS.CATEGORIES_ALL],
  );
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<{ id: string; category: NewCategory }, QueryResponse<Category>>(
    async ({ id, category }) => {
      return await updateCategory(id, category);
    },
    (response, { id }) => {
      queryClient.setQueryData([QUERY_KEYS.CATEGORIES_BY_ID, id], response.data);
    },
    () => [QUERY_KEYS.CATEGORIES_ALL],
  );
};

export const useDeleteCategory = () => {
  return useGenericMutation<string, QueryResponse<Category>>(
    deleteCategory,
    () => {},
    () => [QUERY_KEYS.CATEGORIES_ALL],
  );
};
