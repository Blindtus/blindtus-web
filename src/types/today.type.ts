import type { Music } from './audio.type';
import type { Media } from './media.type';
import type { PixelatedImage } from './pixelatedImage.type';

export type GameType = 'blindtus' | 'pixelus' | 'castus' | 'hotDate';

export const GameTypes = Object.freeze({
  BLINDTUS: 'blindtus' as GameType,
  PIXELUS: 'pixelus' as GameType,
  CASTUS: 'castus' as GameType,
  HOT_DATE: 'hotDate' as GameType,
});

export type Today = {
  _id: string;
  blindtus?: Music;
  pixelus?: PixelatedImage;
  castus?: Media;
  hotDate?: Media;
  createdAt: Date;
};

export type HistoryTodayDatas = {
  attempts: Array<string>;
  isCompleted: boolean;
  isCorrect: boolean;
  type: string;
};

export type HistoryTodayDocument = {
  today: Today;
  todayId: string;
  history: Array<string>;
};
