import { TODAY_CATEGORIES } from '@/constants/todayCategories';
import type { GameType } from '@/types/today.type';

export const getTodayNextCategory = (currentCategorySlug: GameType) => {
  const categoryIndex = TODAY_CATEGORIES.findIndex(
    (category) => category.game === currentCategorySlug,
  );

  if (categoryIndex === -1) {
    return TODAY_CATEGORIES[0];
  }

  if (categoryIndex === TODAY_CATEGORIES.length - 1) {
    return TODAY_CATEGORIES[0];
  }

  const nextCategory = TODAY_CATEGORIES[categoryIndex + 1];

  return nextCategory;
};
