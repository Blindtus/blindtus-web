import { getTranslations } from 'next-intl/server';

import AlertComeBack from '@/components/Alert/AlertComeBack';
import ListTodayCards from '@/components/ListTodayCards/ListTodayCards';
import ShareTodayResults from '@/components/Share/ShareTodayResults';

export default async function Home() {
  const translations = await getTranslations();
  const __ = (key: string) => translations.raw(key);

  return (
    <main className="container">
      <div className="mt-16 justify-between xs:flex">
        <h1 className="page-title">{__('!text:today-game-title')}</h1>

        <ShareTodayResults className="mb-4 w-full xs:mb-0 xs:w-auto" />
      </div>

      <div className="flex flex-col gap-4">
        <AlertComeBack />

        <ListTodayCards />
      </div>
    </main>
  );
}
