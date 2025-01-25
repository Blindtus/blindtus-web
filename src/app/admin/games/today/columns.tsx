'use client';

import Link from 'next/link';
import { useCallback } from 'react';

import { ColumnDef, Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { useDeleteToday } from '@/lib/react-query/TodayQueries';
import type { Music } from '@/types/audio.type';
import type { Media } from '@/types/media.type';
import type { PixelatedImage } from '@/types/pixelatedImage.type';
import type { Today } from '@/types/today.type';

export const columns: ColumnDef<Today>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const today = row.original;

      return (
        <Link href={`/admin/games/today/${today._id}`}>
          {format(today.createdAt, 'dd MMM yyyy')}
        </Link>
      );
    },
  },
  {
    accessorKey: 'blindtus',
    header: 'Blindtus',
    cell: ({ row }) => {
      const music: Music = row.getValue('blindtus');
      return (
        <Badge variant={music ? 'default' : 'destructive'}>{music ? 'OK' : 'Not created'}</Badge>
      );
    },
  },
  {
    accessorKey: 'pixelus',
    header: 'Pixelus',
    cell: ({ row }) => {
      const pixelus: PixelatedImage = row.getValue('pixelus');
      return (
        <Badge variant={pixelus ? 'default' : 'destructive'}>
          {pixelus ? 'OK' : 'Not created'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'castus',
    header: 'Castus',
    cell: ({ row }) => {
      const castus: Media = row.getValue('castus');
      return (
        <Badge variant={castus ? 'default' : 'destructive'}>{castus ? 'OK' : 'Not created'}</Badge>
      );
    },
  },
  {
    accessorKey: 'hotDate',
    header: 'Hot Date',
    cell: ({ row }) => {
      const hotDate: Media = row.getValue('hotDate');
      return (
        <Badge variant={hotDate ? 'default' : 'destructive'}>
          {hotDate ? 'OK' : 'Not created'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'shuffleUp',
    header: 'ShuffleUp',
    cell: ({ row }) => {
      const scramblus: Media = row.getValue('scramblus');
      return (
        <Badge variant={scramblus ? 'default' : 'destructive'}>
          {scramblus ? 'OK' : 'Not created'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <ActionCell row={row} />;
    },
  },
];

const ActionCell = ({ row }: { row: Row<Today> }) => {
  const today = row.original;
  const { mutateAsync: deleteToday } = useDeleteToday();

  const handleOnDelete = useCallback(async () => {
    try {
      await deleteToday(today._id);

      toast({
        title: 'Today game deleted',
      });
    } catch (error) {
      toast({
        title: 'Failed to delete today game',
        variant: 'destructive',
      });
      throw new Error(error as string);
    }
  }, [deleteToday, today._id]);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0 text-right">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={handleOnDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
