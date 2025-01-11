import { Music } from '@/types/audio.type';
import type { Media } from '@/types/media.type';
import { PixelatedImage } from '@/types/pixelatedImage.type';
import type { QueryResponse } from '@/types/query.type';
import { callApi } from '@/utils/apiUtils';

export const getAllMedias = async ({
  category,
  skip,
  limit,
  filter,
}: {
  category: string;
  skip: number;
  limit: number;
  filter?: {
    title?: string;
    status?: string;
    year?: {
      operator: string;
      value?: number;
    };
    audiosCount?: {
      operator: string;
      value?: number;
    };
  };
}) => {
  try {
    const query = new URLSearchParams({
      categories: category,
      skip: skip.toString(),
      limit: limit.toString(),
      filter: JSON.stringify(filter),
    });

    const response: QueryResponse<Media[]> = await callApi({
      endpoint: `/media?${query.toString()}`,
      method: 'GET',
    });

    return response;
  } catch (error) {
    console.error('Failed to fetch medias', error);
    return null;
  }
};

export const getMediaById = async (mediaId: string) => {
  try {
    const response: QueryResponse<Media> = await callApi({
      endpoint: `/media/${mediaId}`,
      method: 'GET',
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch media', error);
    return null;
  }
};

export const addMedia = async (tmdbId: string, categoryId: string) => {
  try {
    const response: QueryResponse<Media> = await callApi({
      endpoint: '/media',
      method: 'POST',
      data: {
        mediaId: tmdbId,
        categoryId,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to create media', error);
    return {
      error: {
        message: 'Failed to create media',
      },
    };
  }
};

export const updateMedia = async (mediaId: string, media: Partial<Media>) => {
  try {
    const response: QueryResponse<Media> = await callApi({
      endpoint: `/admin/media/${mediaId}`,
      method: 'PATCH',
      data: media,
    });

    return response;
  } catch (error) {
    console.error('Failed to update media', error);
    return {
      error: {
        message: 'Failed to update media',
      },
    };
  }
};

export const deleteMedia = async (mediaId: string) => {
  try {
    const response: QueryResponse<Media> = await callApi({
      endpoint: `/admin/media/${mediaId}`,
      method: 'DELETE',
    });

    return response;
  } catch (error) {
    console.error('Failed to delete media', error);
    return {
      error: {
        message: 'Failed to delete media',
      },
    };
  }
};

export const crawlMedia = async (mediaId: string) => {
  try {
    const response: QueryResponse<Media> = await callApi({
      endpoint: `/admin/media/${mediaId}/crawl`,
      method: 'POST',
    });

    return response;
  } catch (error) {
    console.error('Failed to crawl media', error);
    return {
      error: {
        message: 'Failed to crawl media',
      },
    };
  }
};

export const getMediaMusics = async (mediaId: string) => {
  try {
    const response: QueryResponse<Music[]> = await callApi({
      endpoint: `/media/${mediaId}/music`,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch media musics', error);
    return null;
  }
};

export const getMediaPixelatedImages = async (mediaId: string) => {
  try {
    const response: QueryResponse<PixelatedImage[]> = await callApi({
      endpoint: `/media/${mediaId}/pixelated-image`,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch media pixelated images', error);
    return null;
  }
};
