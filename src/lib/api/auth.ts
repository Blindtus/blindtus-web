import type { AuthUser, AuthUserLogin } from '@/types/auth.type';
import type { QueryResponse } from '@/types/query.type';
import { User } from '@/types/user.type';
import { callApi } from '@/utils/apiUtils';

export const askLogin = async ({ email, password }: AuthUserLogin) => {
  try {
    const response: QueryResponse<AuthUser> = await callApi({
      endpoint: '/user/login',
      method: 'POST',
      data: { email, password },
    });

    return response;
  } catch (error) {
    console.error('Failed to login', error);
    return { error: { message: 'Failed to login' } };
  }
};

export const askMe = async () => {
  try {
    const response: QueryResponse<User> = await callApi({
      endpoint: '/user/me',
      method: 'GET',
    });

    if (!response.data) {
      throw new Error('Failed to get user data');
    }

    return response;
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      throw error.response || new Error('Failed to fetch user data');
    } else {
      throw new Error('Failed to fetch user data');
    }
  }
};

export const askRefreshToken = async () => {
  try {
    const response: QueryResponse<User> = await callApi({
      endpoint: '/user/refresh',
      method: 'POST',
    });

    if (!response.data) {
      throw new Error('Failed to refresh token');
    }

    return response;
  } catch (error) {
    if (error instanceof Error && 'response' in error) {
      throw error.response || new Error('Failed to refresh token');
    } else {
      throw new Error('Failed to refresh token');
    }
  }
};

export const askLogout = async () => {
  try {
    const response: QueryResponse<null> = await callApi({
      endpoint: '/user/logout',
      method: 'POST',
    });

    return response;
  } catch (error) {
    console.error('Failed to logout', error);
    return { error: { message: 'Failed to logout' } };
  }
};
