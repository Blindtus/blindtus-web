'use client';

import Link from 'next/link';
import { useCallback } from 'react';

import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUpdateRoadmapItem } from '@/lib/react-query/RoadmapQueries';
import { type Roadmap, RoadmapStatus, type RoadmapStatusType } from '@/types/roadmap.type';

export const columns: ColumnDef<Roadmap>[] = [
  {
    accessorKey: 'title.en',
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
    cell: ({ row }) => {
      const { _id, title } = row.original;

      return (
        <Link
          href={`/admin/roadmap/${_id}`}
          className="block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {title.en}
        </Link>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <RoadmapStatusChip row={row} />;
    },
  },
];

const RoadmapStatusChip = ({ row }: { row: Row<Roadmap> }) => {
  const { mutate: updateRoadmapStatus } = useUpdateRoadmapItem();

  const status = row.original.status;
  let badgeVariant: BadgeProps['variant'] = 'info';

  if (status === 'in-progress') {
    badgeVariant = 'warning';
  } else if (status === 'completed') {
    badgeVariant = 'success';
  }

  const onSelectStatus = useCallback(
    (status: RoadmapStatusType) => {
      updateRoadmapStatus({
        roadmapId: row.original._id,
        roadmap: {
          status,
        },
      });
    },
    [row.original._id, updateRoadmapStatus],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-[100px]">
          <Badge variant={badgeVariant} className="cursor-pointer">
            {row.original.status}
          </Badge>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Select a status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => onSelectStatus('planned')} className="text-blue-400">
            {RoadmapStatus.planned}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => onSelectStatus('in-progress')}
            className="text-orange-400"
          >
            {RoadmapStatus['in-progress']}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => onSelectStatus('completed')}
            className="text-emerald-400"
          >
            {RoadmapStatus.completed}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
