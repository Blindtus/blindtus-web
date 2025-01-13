import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';

import { MoreHorizontal } from 'lucide-react';

import Loader from '@/components/Loader/Loader';
import MediaPoster from '@/components/Poster/MediaPoster';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteMedia, useUpdateMedia } from '@/lib/react-query/MediaQueries';
import type { Media } from '@/types/media.type';

type MediaCardProps = {
  media: Media;
  category: {
    _id: string;
    slug: string;
  };
};

const MediaCard = ({ media, category }: MediaCardProps) => {
  const { mutateAsync: updateMedia } = useUpdateMedia();
  const { mutateAsync: removeMedia, isPending: isLoadingRemoveMedia } = useDeleteMedia();

  const mediaSlug = useMemo(
    () => media.title.fr.toLowerCase().replace(/ /g, '-'),
    [media.title.fr],
  );

  const url = useMemo(
    () => `/admin/medias/${category.slug}/${mediaSlug}/${media._id}`,
    [category.slug, media._id, mediaSlug],
  );

  const handleToggleVerified = useCallback(
    (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      try {
        event.preventDefault();
        event.stopPropagation();

        if (!media) {
          return;
        }

        updateMedia({
          mediaId: media._id,
          media: {
            verified: !media.verified,
          },
        });
      } catch (error) {
        console.error('Failed to update media', error);
      }
    },
    [media, updateMedia],
  );

  const handleDelete = useCallback(async () => {
    try {
      await removeMedia(media._id);
    } catch (error) {
      console.error('Error while deleting media', error);
    }
  }, [media._id, removeMedia]);

  return (
    <div className="flex items-start justify-between">
      <Link href={url} passHref className="flex-1 transition-all">
        <div className="flex w-full gap-6 py-6">
          <div className="w-24">
            <MediaPoster title={media.title.en} posterPath={media.selectedPoster} />
          </div>

          <div className="flex-1 space-y-1.5">
            <h2 className="text-lg font-semibold">{media.title.fr}</h2>
            <p className="text-sm text-gray-500">{media.releaseDate}</p>
            <div className="flex gap-2">
              <Badge
                variant={media.audiosCount === 0 ? 'destructive' : 'secondary'}
                className="text-nowrap"
              >
                Audios: {media.audiosCount}
              </Badge>
              <Badge
                variant={media.pixelatedImagesCount === 0 ? 'destructive' : 'secondary'}
                className="text-nowrap"
              >
                Pixelated: {media.pixelatedImagesCount}
              </Badge>
            </div>
            <div className="mt-4">
              <Button
                variant={media?.verified ? 'success' : 'destructive'}
                size="sm"
                className="mt-4"
                onClick={handleToggleVerified}
              >
                {media.verified ? 'Verified' : 'Not verified'}
              </Button>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0 text-right">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={url}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={handleToggleVerified}>
              {media.verified ? 'Verified' : 'Not verified'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
              {isLoadingRemoveMedia ? <Loader /> : 'Delete'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MediaCard;
