'use client';

import Link from 'next/link';

import Loader from '@/components/Loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetToday } from '@/lib/react-query/TodayQueries';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

const TodayStatusCard = ({ className = '' }: Props) => {
  const { data: today, isLoading } = useGetToday();
  return (
    <Link href={`/admin/games/today/${today?._id}`}>
      <Card>
        <CardHeader
          className={cn('flex flex-row items-center justify-between space-y-0 pb-2', className)}
        >
          <CardTitle className="text-sm font-medium">Today status</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-4">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>Blindtus</div>
                <div
                  className={cn('size-2 rounded-full', {
                    'bg-green-500': today?.blindtus,
                    'bg-rose-500': !today?.blindtus,
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>Pixelus</div>
                <div
                  className={cn('size-2 rounded-full', {
                    'bg-green-500': today?.pixelus,
                    'bg-rose-500': !today?.pixelus,
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>Castus</div>
                <div
                  className={cn('size-2 rounded-full', {
                    'bg-green-500': today?.castus,
                    'bg-rose-500': !today?.castus,
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>Hot Date</div>
                <div
                  className={cn('size-2 rounded-full', {
                    'bg-green-500': today?.hotDate,
                    'bg-rose-500': !today?.hotDate,
                  })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default TodayStatusCard;
