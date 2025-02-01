import { QueryResponse } from '@/types/query.type';
import { type NewRoadmap, type Roadmap } from '@/types/roadmap.type';
import { callApi } from '@/utils/apiUtils';

export const getRoadmapList = async () => {
  try {
    const response: QueryResponse<Roadmap[]> = await callApi({
      endpoint: '/roadmap',
      method: 'GET',
    });

    return response;
  } catch (error) {
    console.error('Failed to fetch roadmap list', error);
    return null;
  }
};

export const askCreateRoadmap = async (roadmap: NewRoadmap) => {
  try {
    const response: QueryResponse<Roadmap> = await callApi({
      endpoint: '/admin/roadmap',
      method: 'POST',
      data: roadmap,
    });

    return response;
  } catch (error) {
    console.error('Failed to create roadmap', error);
    return {
      error: {
        message: 'Failed to create roadmap',
      },
    };
  }
};

export const askUpdateRoadmap = async (id: string, roadmap: NewRoadmap) => {
  try {
    const response: QueryResponse<Roadmap> = await callApi({
      endpoint: `/admin/roadmap/${id}`,
      method: 'PATCH',
      data: roadmap,
    });

    return response;
  } catch (error) {
    console.error('Failed to update roadmap', error);
    return {
      error: {
        message: 'Failed to update roadmap',
      },
    };
  }
};
