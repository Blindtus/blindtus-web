'use client';

import { useMemo, useState } from 'react';

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllTimeTodayAnalytic, useGetTodayAnalytic } from '@/lib/react-query/AnalyticQueries';
import { cn } from '@/lib/utils';
import { GameType } from '@/types/today.type';

const chartConfig = {
  played: {
    label: 'Played',
    color: 'hsl(var(--chart-1))',
  },
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-2))',
  },
  win: {
    label: 'Win',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

type Props = {
  className?: string;
  gameType: GameType;
};

const TodayAnalytic = ({ className = '', gameType }: Props) => {
  const [selectedTab, setSelectedTab] = useState('today');
  const { data: todayAnalytic } = useGetTodayAnalytic();
  const { data: allTimeAnalytic } = useGetAllTimeTodayAnalytic();

  const analytic = useMemo(
    () => (selectedTab === 'today' ? todayAnalytic : allTimeAnalytic),
    [selectedTab, todayAnalytic, allTimeAnalytic],
  );

  const chartData = useMemo(() => {
    if (!analytic) return [];

    const data = analytic.categories.find((item) => item.category === gameType);

    if (!data) return [];

    return [
      {
        category: data.category,
        played: data.playedCount,
        completed: data.completedCount,
        win: data.winCount,
      },
    ];
  }, [analytic, gameType]);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Today analytics - {gameType}</CardTitle>

        <Tabs
          defaultValue="today"
          className="w-auto max-w-xs"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="grid w-full grid-cols-2 px-1.5 py-1">
            <TabsTrigger value="today" className="py-1">
              Today
            </TabsTrigger>
            <TabsTrigger value="all-time" className="py-1">
              All time
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="category" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />

            <Bar dataKey="played" fill="var(--color-played)" radius={4} />
            <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
            <Bar dataKey="win" fill="var(--color-win)" radius={4} />
            <Legend />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TodayAnalytic;
