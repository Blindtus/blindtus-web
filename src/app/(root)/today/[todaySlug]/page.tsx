import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

import { getLocale } from 'next-intl/server';

import Loader from '@/components/Loader/Loader';
import TodayGame from '@/components/TogayGame/TodayGame';
import { TODAY_CATEGORIES } from '@/constants/todayCategories';
import { TodayGameProvider } from '@/context/TodayGameContext';
import { GameType } from '@/types/today.type';

type TodayPageProps = {
  params: Promise<{
    todaySlug: string;
  }>;
};

const TodayPage = async ({ params }: TodayPageProps) => {
  const { todaySlug } = await params;
  const locale = await getLocale();
  const category = TODAY_CATEGORIES.find((category) => category.slug === todaySlug);

  const label = category?.label[locale];

  if (!category) {
    redirect('/');
  }

  return (
    <main className="container">
      <div className="mt-16 justify-between md:flex">
        <h1 className="page-title--no-spacing mb-2">{label}</h1>
      </div>
      <Suspense fallback={<Loader />}>
        <TodayGameProvider gameType={category.id as GameType}>
          <TodayGame />
        </TodayGameProvider>
      </Suspense>
    </main>
  );
};

export default TodayPage;
