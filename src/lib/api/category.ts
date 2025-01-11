import { Category, NewCategory } from '@/types/category.type';
import type { QueryResponse } from '@/types/query.type';
import { callApi } from '@/utils/apiUtils';

export const getAllCategories = async () => {
  try {
    const response: QueryResponse<Category[]> = await callApi({
      endpoint: '/category',
    });

    return response;
  } catch (error) {
    console.error('Failed to get categories', error);
    return null;
  }
};

export const getCategoryById = async (categoryId: string) => {
  try {
    const response: QueryResponse<Category> = await callApi({
      endpoint: `/category/${categoryId}`,
    });

    return response;
  } catch (error) {
    console.error('Failed to get category', error);
    return null;
  }
};

export const getCategoryBySlug = async (categorySlug: string) => {
  try {
    const response: QueryResponse<Category> = await callApi({
      endpoint: `/category/slug/${categorySlug}`,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to get category', error);
    return null;
  }
};

export const createCategory = async (category: NewCategory) => {
  try {
    const response: QueryResponse<Category> = await callApi({
      endpoint: '/category',
      method: 'POST',
      data: category,
    });

    return response;
  } catch (error) {
    console.error('Failed to create category', error);
    return {
      error: {
        message: 'Failed to create category',
      },
    };
  }
};

export const updateCategory = async (categoryId: string, category: NewCategory) => {
  try {
    const response: QueryResponse<Category> = await callApi({
      endpoint: `/category/${categoryId}`,
      method: 'PATCH',
      data: category,
    });

    return response;
  } catch (error) {
    console.error('Failed to update category', error);
    return {
      error: {
        message: 'Failed to update category',
      },
    };
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const response: QueryResponse<Category> = await callApi({
      endpoint: `/category/${categoryId}`,
      method: 'DELETE',
    });

    return response;
  } catch (error) {
    console.error('Failed to delete category', error);
    return {
      error: {
        message: 'Failed to delete category',
      },
    };
  }
};
