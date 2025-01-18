import { Analytic, TodayAnalytic } from '@/types/analytic.type';
import { QueryResponse } from '@/types/query.type';
import { type GameType } from '@/types/today.type';
import { callApi } from '@/utils/apiUtils';

export const incrementPlayCount = async (category: GameType) => {
  try {
    const response: QueryResponse<Analytic> = await callApi({
      endpoint: `/analytic/played`,
      method: 'POST',
      data: {
        category,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to increment play count', error);
    return null;
  }
};

export const incrementCompletedCount = async (category: GameType) => {
  try {
    const response: QueryResponse<Analytic> = await callApi({
      endpoint: `/analytic/completed`,
      method: 'POST',
      data: {
        category,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to increment completed count', error);
    return null;
  }
};

export const incrementWinCount = async (category: GameType) => {
  try {
    const response: QueryResponse<Analytic> = await callApi({
      endpoint: `/analytic/win`,
      method: 'POST',
      data: {
        category,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to increment win count', error);
    return null;
  }
};

export const askGetTodayAnalytic = async () => {
  try {
    const response: QueryResponse<TodayAnalytic> = await callApi({
      endpoint: `/admin/analytic/today`,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch today analytic', error);
    return null;
  }
};

export const askGetAllTimeTodayAnalytic = async () => {
  try {
    const response: QueryResponse<TodayAnalytic> = await callApi({
      endpoint: `/admin/analytic/all-time`,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch today analytic', error);
    return null;
  }
};
