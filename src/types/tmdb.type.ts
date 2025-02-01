import { type MediaType } from './category.type';

export type TMDBSearchMedia = {
  id: number;
  title?: {
    en: string;
    fr: string;
  };
  name?: string;
  original_title?: string;
  original_name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  overview: {
    en: string;
    fr: string;
  };
  isSaved?: boolean;
  media_type: MediaType;
};
