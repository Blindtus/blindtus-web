import { useCallback, useMemo, useState } from 'react';

import { MediaPixelateListItem } from '@/components/Admin/MediaPixelateListItem';
import { MediaPosterListItem } from '@/components/Admin/MediaPosterListItem';
import Loader from '@/components/Loader/Loader';
import Actor from '@/components/Media/Actor';
import SortableWrapper from '@/components/Sortable/SortableWrapper';
import InputTag from '@/components/ui-custom/InputTag';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useViewport from '@/hooks/use-viewport';
import {
  useGenerateScramble,
  useGetMedia,
  useGetMediaPixelatedImages,
  useUpdateMedia,
} from '@/lib/react-query/MediaQueries';
import type { Cast } from '@/types/media.type';

import { MediaBackdropListItem } from '../MediaBackdropListItem';

type MediaDetailContentProps = {
  mediaId: string;
};

const MediaDetailContent = ({ mediaId }: MediaDetailContentProps) => {
  const { isXs, isSm, isMd } = useViewport();

  const { data: media, isFetching: isMediaFetching } = useGetMedia(mediaId);
  const { data: pixelatedImages, isFetching: isPixelatedImagesFetching } =
    useGetMediaPixelatedImages(mediaId);
  const { mutate: updateMedia } = useUpdateMedia();
  const { mutate: updateScrambleTitles, isPending } = useGenerateScramble();
  const [casts, setCasts] = useState<Array<Cast>>(media?.casts || []);

  const handleSetSelectedPoster = useCallback(
    (poster: string) => {
      if (!media) {
        return;
      }

      updateMedia({
        mediaId,
        media: {
          selectedPoster: poster,
        },
      });
    },
    [media, mediaId, updateMedia],
  );

  const handleSetSelectedBackdrop = useCallback(
    (backdrop: string) => {
      if (!media) {
        return;
      }

      updateMedia({
        mediaId,
        media: {
          selectedBackdrop: backdrop,
        },
      });
    },
    [media, mediaId, updateMedia],
  );

  const handleUpdateSimpleTitles = useCallback(
    (simpleTitles: Array<string>) => {
      updateMedia({
        mediaId,
        media: {
          simpleTitles,
        },
      });
    },
    [mediaId, updateMedia],
  );

  const renderDate = useMemo(() => {
    if (!media) {
      return null;
    }

    let date = media.releaseDate?.toString();

    if (media.endDate) {
      date = `${date} - ${media.endDate}`;
    }

    if (media.status === 'Ended') {
      date = `${date} (${media.status})`;
    }

    return date;
  }, [media]);

  const handleDragEnd = useCallback(
    (datas: Array<Cast>) => {
      const stringDatas = datas.map((data) => JSON.stringify(data));

      setCasts(datas);

      updateMedia({
        mediaId,
        media: {
          // @ts-expect-error: Cast is not a string
          casts: stringDatas,
        },
      });
    },
    [mediaId, updateMedia],
  );

  const handleScrambleTitles = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      updateScrambleTitles(mediaId);
    },
    [updateScrambleTitles, mediaId],
  );

  if (isMediaFetching) {
    return <Loader />;
  }

  if (!media) {
    return <div>Media not found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-base">{renderDate}</div>

      <div className="flex gap-2">
        {media.genresData?.map((genre) => <Badge key={genre.id}>{genre.fr}</Badge>)}
      </div>
      <p>{media.overview?.fr}</p>

      <Accordion type="multiple">
        <AccordionItem value="cast">
          <AccordionTrigger>Cast</AccordionTrigger>
          <AccordionContent className="p-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:flex-row lg:grid-cols-5">
              <SortableWrapper onChange={handleDragEnd} items={media.casts} keyId="name">
                {casts.map((cast: Cast) => (
                  <Actor
                    key={cast.name}
                    actor={cast}
                    showCharacter
                    isRow={(isXs || isSm) && !isMd}
                  />
                ))}
              </SortableWrapper>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="simpleTitles">
          <AccordionTrigger>
            <span className="flex items-center gap-4">
              Simple titles <Badge>{media.simpleTitles?.length}</Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <InputTag
              placeholder="Add title"
              tags={media.simpleTitles}
              onChange={handleUpdateSimpleTitles}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="backdrops">
          <AccordionTrigger>Backdrops</AccordionTrigger>
          <AccordionContent className="p-2">
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-5">
              {media.backdrops?.map((backdrop) => (
                <MediaBackdropListItem
                  key={backdrop}
                  src={backdrop}
                  isSelected={backdrop === media.selectedBackdrop}
                  onSelectImage={() => handleSetSelectedBackdrop(backdrop)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="posters">
          <AccordionTrigger>Posters</AccordionTrigger>
          <AccordionContent className="p-2">
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-5">
              {media.posters?.map((poster) => (
                <MediaPosterListItem
                  key={poster}
                  src={poster}
                  mediaId={mediaId}
                  category={media.category._id || ''}
                  isSelected={poster === media.selectedPoster}
                  onSelectPoster={() => handleSetSelectedPoster(poster)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="pixelate">
          <AccordionTrigger>
            <span className="flex items-center gap-4">
              Pixelate posters <Badge>{pixelatedImages?.length}</Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <div className="flex flex-col gap-6">
              {!isPixelatedImagesFetching ? (
                pixelatedImages?.map((pixelateImages) => {
                  return (
                    <MediaPixelateListItem
                      key={pixelateImages._id}
                      pixelate={pixelateImages}
                      mediaId={mediaId}
                    />
                  );
                })
              ) : (
                <Loader />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="scrambledTitles">
          <AccordionTrigger>
            <span className="flex items-center gap-4">Scrambled titles</span>
          </AccordionTrigger>
          <AccordionContent className="p-2">
            <Button onClick={handleScrambleTitles} disabled={isPending}>
              Re-generate
            </Button>
            <div className="flex flex-col gap-4">
              <h2>EN</h2>
              <ol className="list-decimal pl-5">
                {media.scrambledTitles?.en.map((title) => <li key={title}>{title}</li>)}
              </ol>
              <h2>FR</h2>
              <ol className="list-decimal pl-5">
                {media.scrambledTitles?.fr.map((title) => <li key={title}>{title}</li>)}
              </ol>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MediaDetailContent;
