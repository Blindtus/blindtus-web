import { TODAY_CATEGORIES } from '@/constants/todayCategories';

import TodayCard from '../TodayCard/TodayCard';

const ListTodayCards = () => {
  return (
    <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
      {TODAY_CATEGORIES.map((category) => (
        <TodayCard key={category.id} category={category} />
      ))}
    </div>
  );
};

export default ListTodayCards;
