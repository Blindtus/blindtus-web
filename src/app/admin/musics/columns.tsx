'use client';

import Link from 'next/link';
import { useCallback } from 'react';

import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import { Button } from '@/components/ui/button';
import { useDeleteMusic } from '@/lib/react-query/MusicQueries';
import type { Music } from '@/types/audio.type';

export const columns: ColumnDef<Music>[] = [
  {
    accessorKey: 'media',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Media
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const media = row.original.media;

      if (!media.title) {
        return null;
      }

      return (
        <Link href={`/admin/medias/movies/${media.slug}/${media._id}?tab=audios`}>
          {media.title.fr}
        </Link>
      );
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'author',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Author
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'audioPath',
    header: 'Audio',
    cell: ({ row }) => <AudioCell row={row} />,
  },
];

const AudioCell = ({ row }: { row: Row<Music> }) => {
  const { mutateAsync: deleteAudio, isPending } = useDeleteMusic();
  const audioUrl = row.getValue('audioPath') as string;
  const audioId = row.original._id;

  const handleOnDelete = useCallback(() => {
    deleteAudio(audioId);
  }, [audioId, deleteAudio]);

  return (
    <AudioPlayer
      key={audioId}
      src={audioUrl}
      audioId={audioId}
      onDeleteClick={handleOnDelete}
      isSmall
      showMoreButton
      isMoreButtonLoading={isPending}
    />
  );
};
