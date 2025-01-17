'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';

import { MoreHorizontal } from 'lucide-react';

import Loader from '@/components/Loader/Loader';
import MediaPoster from '@/components/Poster/MediaPoster';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useCrawlMedia,
  useDeleteMedia,
  useGetMedia,
  useUpdateMedia,
} from '@/lib/react-query/MediaQueries';
import { formatDateFr } from '@/utils/date';

import MediaDetailAudios from './MediaDetailAudios';
import MediaDetailContent from './MediaDetailContent';

type MediaDetailProps = {
  mediaId: string;
};

const MediaDetail = ({ mediaId }: MediaDetailProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const queryTab = searchParams.get('tab') || 'content';

  const { data: media, isFetching: isMediaFetching } = useGetMedia(mediaId);
  const { mutate: updateMedia } = useUpdateMedia();
  const { mutateAsync: removeMedia, isPending: isLoadingRemoveMedia } = useDeleteMedia();
  const { mutate: crawlMedia, isPending: isCrawlPending } = useCrawlMedia();

  const isLoading = useMemo(() => isMediaFetching, [isMediaFetching]);

  const handleChangeTab = useCallback(
    (tab: string) => {
      const params = new URLSearchParams();
      params.set('tab', tab);
      router.push(`?${params.toString()}`);
    },
    [router],
  );

  const handleCrawlMedia = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      crawlMedia(mediaId);
    },
    [crawlMedia, mediaId],
  );

  const handleToggleVerified = useCallback(() => {
    try {
      if (!media) {
        return;
      }

      updateMedia({
        mediaId,
        media: {
          verified: !media.verified,
        },
      });
    } catch (error) {
      console.error('Failed to update media', error);
    }
  }, [media, mediaId, updateMedia]);

  const handleDelete = useCallback(async () => {
    try {
      await removeMedia(mediaId);

      router.push('/admin/medias');
    } catch (error) {
      console.error('Error while deleting media', error);
    }
  }, [mediaId, removeMedia, router]);

  if (isLoading) {
    return <Loader />;
  }

  if (!media) {
    return <div>Media not found</div>;
  }

  return (
    <Tabs defaultValue={queryTab} className="w-full" asChild onValueChange={handleChangeTab}>
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-4 lg:grid-cols-6">
        <div className="sm:sticky sm:top-8 sm:h-4/6">
          <MediaPoster posterPath={media.selectedPoster} title={media.title.fr} size="medium" />
          <TabsList orientation="vertical" className="mt-8 w-full">
            <TabsTrigger value="content" className="w-full">
              Content
            </TabsTrigger>
            <TabsTrigger value="audios" className="w-full">
              Audios
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="sm:col-span-3 lg:col-span-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="page-title--sm">{media.title.fr}</h1>
              <h2 className="font-xl">{media.title.en}</h2>
              <Button
                variant={media?.verified ? 'success' : 'destructive'}
                size="sm"
                className="mt-4"
                onClick={handleToggleVerified}
              >
                {media.verified ? 'Verified' : 'Not verified'}
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0 text-right">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                  Last time crawled:{' '}
                  <span className="font-semibold">
                    {formatDateFr(media.lastTimeCrawled, 'dd MMMM yyyy - HH:mm')}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuItem className="cursor-pointer" onClick={handleCrawlMedia}>
                  {isCrawlPending ? <Loader /> : 'Update datas'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
                  {isLoadingRemoveMedia ? <Loader /> : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <TabsContent value="content">
            <MediaDetailContent mediaId={mediaId} />
          </TabsContent>
          <TabsContent value="audios">
            <MediaDetailAudios media={media} />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
};

export default MediaDetail;
