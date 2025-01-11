export type NewCategory = {
  label?: string;
  labelFr?: string;
  type?: string;
  isDisplayInGame?: boolean;
  isDisplayInToday?: boolean;
  isDisplayInTodayPixelux?: boolean;
  isDisplayInTodayHotDate?: boolean;
};

export type Category = {
  _id: string;
  label: string;
  labelFr: string;
  slug?: string;
  type: string;
  isDisplayInGame?: boolean;
  isDisplayInToday?: boolean;
  isDisplayInTodayPixelux?: boolean;
  isDisplayInTodayHotDate?: boolean;
};

export const LocalMediaTypes = Object.freeze({
  MOVIES: 'movies',
  TVSHOWS: 'tv-shows',
  CARTOONS: 'cartoons-animes',
  VIDEO_GAMES: 'video-games',
});

type LocalMediaKeys = keyof typeof LocalMediaTypes;

export type LocalMediaType = (typeof LocalMediaTypes)[LocalMediaKeys];
