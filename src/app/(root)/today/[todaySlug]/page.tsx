import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';

import { getLocale } from 'next-intl/server';

import Loader from '@/components/Loader/Loader';
import TodayGame from '@/components/TogayGame/TodayGame';
import TodayGameRules from '@/components/TogayGame/TodayGameRules';
import { TODAY_CATEGORIES } from '@/constants/todayCategories';
import { TodayGameProvider } from '@/context/TodayGameContext';
import { GameType } from '@/types/today.type';

type TodayPageProps = {
  params: Promise<{
    todaySlug: string;
  }>;
};

export async function generateMetadata({ params }: TodayPageProps): Promise<Metadata> {
  const { todaySlug } = await params;
  const cookieStore = cookies();
  const locale: 'fr' | 'en' = ((await cookieStore).get('locale')?.value as 'fr' | 'en') || 'en';

  const translations: Record<
    string,
    Record<'en' | 'fr', { title: string; description: string }>
  > = {
    blindtus: {
      en: {
        title: 'Blindtus - Guess the Movie or TV Show by Its Music',
        description:
          'Blindtus challenges you to guess movies and TV shows by their music! Listen to iconic soundtracks or themes and put your cinematic knowledge to the test. Can you name them all?',
      },
      fr: {
        title: 'Blindtus - Devinez le Film ou la Série Grâce à sa Musique',
        description:
          'Blindtus vous met au défi de deviner des films et séries grâce à leur musique ! Écoutez des bandes-son ou thèmes emblématiques et testez vos connaissances cinématographiques. Serez-vous capable de tout deviner ?',
      },
    },
    pixelus: {
      en: {
        title: 'Pixelus - Guess the Movie or TV Show from a Pixelated Poster',
        description:
          'How well do you know your favorite movies and TV shows? In Pixelus, uncover a pixelated poster bit by bit with every guess. The more you play, the clearer the picture gets!',
      },
      fr: {
        title: 'Pixelus - Devinez le Film ou la Série à Partir d’une Affiche Pixelisée',
        description:
          'Connaissez-vous bien vos films et séries préférés ? Dans Pixelus, révélez une affiche pixelisée petit à petit à chaque essai. Plus vous jouez, plus l’image devient nette !',
      },
    },
    castus: {
      en: {
        title: 'Castus - Guess the Movie or TV Show by Its Cast',
        description:
          'Can you guess the movie or TV show based on its actors? Test your knowledge of Hollywood stars and iconic casts in Castus, the fun and challenging guessing game!',
      },
      fr: {
        title: 'Castus - Devinez le Film ou la Série Grâce à son Casting',
        description:
          'Pouvez-vous deviner le film ou la série à partir de ses acteurs ? Testez vos connaissances sur les stars hollywoodiennes et les castings emblématiques dans Castus, un jeu amusant et stimulant !',
      },
    },
    hotDate: {
      en: {
        title: 'Hot Date - Guess the Release Date of a Movie',
        description:
          'Do you know when your favorite movies were released? In Hot Date, guess the release date of a movie and see how close you are to the correct answer. The closer you get, the hotter the date!',
      },
      fr: {
        title: 'Hot Date - Devinez la Date de Sortie d’un Film',
        description:
          'Savez-vous quand vos films préférés sont sortis ? Dans Hot Date, devinez la date de sortie d’un film et voyez à quel point vous êtes proche de la bonne réponse. Plus vous vous rapprochez, plus la date est chaude !',
      },
    },
    titleTwist: {
      en: {
        title: 'Title Twist - Guess the Movie or TV Show from twisted Titles',
        description:
          'In Title Twist, we’ve twisted the titles of your favorite movies and TV shows. Can you untwist them and guess the original titles?',
      },
      fr: {
        title: 'Title Twist - Devinez le Film ou la Série à Partir de Titres Tordus',
        description:
          'Dans Title Twist, nous avons mélangé les titres de vos films et séries préférés. Saurez-vous les décrypter et retrouver les titres originaux ?',
      },
    },
  };

  const { title, description } =
    translations[todaySlug as keyof typeof translations][locale] || translations['blindtus']['en'];

  return {
    title,
    description,
  };
}

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
      <div className="mb-2 mt-16 flex items-center justify-between md:justify-normal">
        <h1 className="page-title--no-spacing">{label}</h1>
        <TodayGameRules
          className="ml-4"
          type={todaySlug as 'blindtus' | 'pixelus' | 'castus' | 'hotDate' | 'titleTwist'}
        />
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
