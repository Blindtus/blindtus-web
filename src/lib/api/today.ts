import { QueryResponse } from '@/types/query.type';
import { Today } from '@/types/today.type';
import { callApi } from '@/utils/apiUtils';

export const getAllToday = async ({ skip, limit }: { skip: number; limit: number }) => {
  try {
    const query = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response: QueryResponse<Today[]> = await callApi({
      endpoint: `/today?${query.toString()}`,
    });

    return response;
  } catch (error) {
    console.error('Failed to fetch today', error);
    return null;
  }
};

export const getToday = async () => {
  try {
    const response: QueryResponse<Today> = await callApi({
      endpoint: `/today/today`,
    });

    if (response.error) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Failed to fetch today', error);
    return null;
  }
};

export const getTodayById = async (todayId: string) => {
  try {
    const response: QueryResponse<Today> = await callApi({
      endpoint: `/today/${todayId}`,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch today', error);
    return null;
  }
};

export const generateTodayGame = async () => {
  try {
    const response: QueryResponse<Today> = await callApi({
      endpoint: `/admin/today`,
      method: 'POST',
    });

    return response;
  } catch (error) {
    console.error('Failed to generate today game', error);
    return {
      error: {
        message: 'Failed to generate today game',
      },
    };
  }
};

export const regenerateTodayGame = async (
  todayId: string,
  { blindtus = false, pixelus = false, castus = false, hotDate = false, titleTwist = false },
) => {
  try {
    const response: QueryResponse<Today> = await callApi({
      endpoint: `/admin/today/${todayId}`,
      method: 'POST',
      data: {
        blindtus,
        pixelus,
        castus,
        hotDate,
        titleTwist,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to regenerate today game', error);
    return {
      error: {
        message: 'Failed to regenerate today game',
      },
    };
  }
};

export const deleteToday = async (todayId: string) => {
  try {
    const response: QueryResponse<Today> = await callApi({
      endpoint: `/admin/today/${todayId}`,
      method: 'DELETE',
    });

    return response;
  } catch (error) {
    console.error('Failed to delete today', error);
    return {
      error: {
        message: 'Failed to delete today',
      },
    };
  }
};
