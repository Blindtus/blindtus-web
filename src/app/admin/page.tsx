import Link from 'next/link';
import React from 'react';

import { ContentLayout } from '@/components/Admin/ContentLayout/ContentLayout';
import TodayAnalytic from '@/components/Admin/Dashboard/TodayAnalytic';
import TodayStatusCard from '@/components/Admin/Dashboard/TodayStatusCard';

const AdminPage = () => {
  return (
    <ContentLayout title="Dashboard">
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Status Card */}
          <TodayStatusCard className="row-span-2 lg:col-span-2" />

          {/* Add Movie and Add TV Show */}
          <div className="flex flex-col gap-4">
            <Link
              href="/admin/medias/movies"
              className="flex flex-1 items-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
            >
              Add movie
            </Link>
            <Link
              href="/admin/medias/tv-shows"
              className="flex flex-1 items-center rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
            >
              Add TV show
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-8 lg:grid-cols-12">
          <TodayAnalytic className="col-span-4" gameType="blindtus" />
          <TodayAnalytic className="col-span-4" gameType="pixelus" />
          <TodayAnalytic className="col-span-4" gameType="castus" />
          <TodayAnalytic className="col-span-4" gameType="hotDate" />
          <TodayAnalytic className="col-span-4" gameType="titleTwist" />
        </div>
      </div>
    </ContentLayout>
  );
};

export default AdminPage;
