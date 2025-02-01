'use client';

import React, { useMemo } from 'react';

import { useLocale } from 'next-intl';

import MediaButtonAction from '@/components/Admin/MediaButtonAction/MediaButtonAction';
import MediaPoster from '@/components/Poster/MediaPoster';
import type { TMDBSearchMedia } from '@/types/tmdb.type';

type MediaCardSearchProps = {
  media: TMDBSearchMedia;
  showActions?: boolean;
  categoryId?: string;
};

const MediaCardSearch = ({ media, showActions = false, categoryId }: MediaCardSearchProps) => {
  const locale = useLocale() as 'en' | 'fr';

  const title = useMemo(
    () => media.title?.[locale] || media.title?.en || media.title?.fr,
    [locale, media.title],
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex w-full gap-6 py-6">
        <div className="w-24">
          <MediaPoster title={title} posterPath={media.poster_path} />
        </div>

        <div className="flex-1 space-y-1.5">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{media.release_date?.slice(0, 4)}</p>
        </div>

        {showActions && !!categoryId ? (
          <div className="ml-auto">
            <MediaButtonAction mediaId={media.id} categoryId={categoryId} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MediaCardSearch;
