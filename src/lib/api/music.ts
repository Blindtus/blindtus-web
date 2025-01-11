import { Music, NewMusic } from '@/types/audio.type';
import { QueryResponse } from '@/types/query.type';
import { callApi } from '@/utils/apiUtils';

export const getAllMusic = async ({ skip, limit }: { skip: number; limit: number }) => {
  try {
    const query = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response: QueryResponse<Music[]> = await callApi({
      endpoint: `/music?${query.toString()}`,
    });

    return response;
  } catch (error) {
    console.error('Failed to fetch musics', error);
    return null;
  }
};

export const addMusic = async (music: NewMusic) => {
  try {
    const formData = new FormData();
    formData.append('title', music.title);
    formData.append('author', music.author);
    formData.append('duration', music.duration.toString());
    formData.append('startAt', music.startAt.toString());
    formData.append('media', music.media);
    formData.append('audio', music.audio);

    const response: QueryResponse<Music> = await callApi({
      endpoint: `/admin/music`,
      method: 'POST',
      formData,
    });

    return response;
  } catch (error) {
    console.error('Failed to add music', error);
    return {
      error: {
        message: 'Failed to add music',
      },
    };
  }
};

export const updateMusic = async (musicId: string, music: Partial<Music>) => {
  try {
    const response: QueryResponse<Music> = await callApi({
      endpoint: `/admin/music/${musicId}`,
      method: 'PATCH',
      data: music,
    });

    return response;
  } catch (error) {
    console.error('Failed to update music', error);
    return {
      error: {
        message: 'Failed to update music',
      },
    };
  }
};

export const deleteMusic = async (musicId: string) => {
  try {
    const response: QueryResponse<Music> = await callApi({
      endpoint: `/admin/music/${musicId}`,
      method: 'DELETE',
    });

    return response;
  } catch (error) {
    console.error('Failed to delete music', error);
    return {
      error: {
        message: 'Failed to delete music',
      },
    };
  }
};
