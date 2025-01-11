import type { PixelatedImage } from '@/types/pixelatedImage.type';
import { QueryResponse } from '@/types/query.type';
import { callApi } from '@/utils/apiUtils';

export const createPixelatedImages = async (image: string, mediaId: string) => {
  try {
    const response: QueryResponse<PixelatedImage> = await callApi({
      endpoint: '/admin/pixelated-image',
      method: 'POST',
      data: {
        image,
        mediaId,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to create pixelated images', error);
    return {
      error: {
        message: 'Failed to create pixelated image',
      },
    };
  }
};

export const deletePixelatedImages = async (pixelateImageId: string) => {
  try {
    const response: QueryResponse<PixelatedImage> = await callApi({
      endpoint: `/admin/pixelated-image/${pixelateImageId}`,
      method: 'DELETE',
    });

    return response;
  } catch (error) {
    console.error('Failed to delete pixelated images', error);
    return {
      error: {
        message: 'Failed to delete pixelated image',
      },
    };
  }
};
