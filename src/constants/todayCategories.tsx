import { BookImage, CalendarSearch, Music, User2 } from 'lucide-react';

import type { GameType } from '@/types/today.type';

export const TODAY_CATEGORIES: Array<{
  id: string;
  label: Record<string, string>;
  slug: string;
  icon: React.ReactNode;
  game: GameType;
}> = [
  {
    id: 'blindtus',
    label: {
      en: 'Blindtus',
      fr: 'Blindtus',
    },
    slug: 'blindtus',
    icon: <Music />,
    game: 'blindtus',
  },
  {
    id: 'pixelus',
    label: {
      en: 'Pixelus',
      fr: 'Pixelus',
    },
    slug: 'pixelus',
    icon: <BookImage />,
    game: 'pixelus',
  },
  {
    id: 'castus',
    label: {
      en: 'Castus',
      fr: 'Castus',
    },
    slug: 'castus',
    icon: <User2 />,
    game: 'castus',
  },
  {
    id: 'hotDate',
    label: {
      en: 'Hot Date',
      fr: 'Hot Date',
    },
    slug: 'hotDate',
    icon: <CalendarSearch />,
    game: 'hotDate',
  },
];
