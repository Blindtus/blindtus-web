import { useCallback, useMemo } from 'react';

import { PlusIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import MediaPoster from '@/components/Poster/MediaPoster';
import { useAddMediaSuggest } from '@/lib/react-query/MediaQueries';
import { cn } from '@/lib/utils';
import { type TMDBSearchMedia } from '@/types/tmdb.type';

import Loader from '../Loader';
import { Button } from '../ui/button';

type Props = {
  className?: string;
  media: TMDBSearchMedia;
};

const MediaCardSuggest = ({ className = '', media }: Props) => {
  const locale = useLocale() as 'en' | 'fr';
  const __ = useTranslations('');

  const { mutateAsync: addMedia, isSuccess, isPending } = useAddMediaSuggest();

  const title = useMemo(
    () => media.title?.[locale] || media.title?.en || media.title?.fr,
    [locale, media.title],
  );

  const buttonLabel = useMemo(() => {
    if (media.isSaved || isSuccess) return __('!nount:added');
    if (isPending) return <Loader size="small" />;
    return (
      <>
        <PlusIcon size={16} />
        {__('!nount:add')}
      </>
    );
  }, [isSuccess, media.isSaved, __, isPending]);

  const onAddMedia = useCallback(async () => {
    await addMedia({ mediaId: media.id.toString(), mediaType: media.media_type });
  }, [addMedia, media.id, media.media_type]);

  if (!media.poster_path) return null;

  return (
    <div className={cn(className)}>
      <div className="flex flex-col gap-2">
        <MediaPoster size="large" title={title} posterPath={media.poster_path} />
        <Button
          variant={media.isSaved || isSuccess ? 'secondary' : 'primary'}
          size="sm"
          disabled={media.isSaved || isSuccess || isPending}
          onClick={onAddMedia}
        >
          {buttonLabel}
        </Button>
        <div className="flex-1 space-y-1.5">
          <p className="text-sm">{media.release_date?.slice(0, 4)}</p>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </div>
    </div>
  );
};

export default MediaCardSuggest;
