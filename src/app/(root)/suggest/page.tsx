import { getTranslations } from 'next-intl/server';

import SuggestSearch from '@/components/Suggest/Search';

const SuggestPage = async () => {
  const translations = await getTranslations();
  const __ = (key: string) => translations.raw(key);

  return (
    <main className="container">
      <div className="mt-16">
        <h1 className="page-title">{__('!text:suggest-title')}</h1>
        <p className="text-lg">{__('!text:suggest-description')}</p>
      </div>

      <div className="mt-8">
        <SuggestSearch />
      </div>
    </main>
  );
};

export default SuggestPage;
