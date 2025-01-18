import { Today } from './today.type';

export type Analytic = {
  _id: string;
  category: 'blindtus' | 'pixelus' | 'castus' | 'hotDate';
  date: string; // Format: YYYY-MM-DD
  playedCount: number;
  completedCount: number;
  winCount: number;
  today: Today;
};

export type TodayAnalytic = {
  date: string;
  today: string;
  categories: {
    category: string;
    completedCount: number;
    playedCount: number;
    winCount: number;
  }[];
};
