import type { Music } from './audio.type';
import type { Category } from './category.type';

export type Cast = {
  name: string;
  photo: string;
  character: string;
};

export type Media = {
  _id: string;
  slug: string;
  titleNormalized: {
    en: string;
    fr: string;
  };
  title: {
    en: string;
    fr: string;
  };
  simpleTitles?: string[];
  directors?: string[];
  casts: Cast[];
  backdrops?: string[];
  posters?: string[];
  selectedBackdrop: string;
  selectedPoster: string;
  releaseDate?: number;
  endDate?: number;
  imdbId?: string;
  tmdbId?: number;
  overview?: {
    en: string;
    fr: string;
  };
  genres?: number[];
  genresData?: {
    id: number;
    fr: string;
    en: string;
  }[];
  keywords: string[];
  networks?: string[];
  numberOfEpisodes?: number;
  numberOfSeasons?: number;
  status?: string;
  verified: boolean;
  musics?: Music[];
  audiosCount?: number;
  pixelatedImagesCount?: number;
  category: Category;
  forcePropositions: Media[];
  lastTimeCrawled: Date;
  similar?: Media[];
};

export const MediaStatus = Object.freeze({
  ENDED: 'Ended',
  CANCELED: 'Canceled',
  RETURNING: 'Returning Series',
  IN_PRODUCTION: 'In Production',
  PLANNED: 'Planned',
  PILOT: 'Pilot',
});

type MediaStatusKeys = keyof typeof MediaStatus;

export type MediaStatusType = (typeof MediaStatus)[MediaStatusKeys];
