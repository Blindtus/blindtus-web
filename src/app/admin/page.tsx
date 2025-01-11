'use client';

import React from 'react';

import { ContentLayout } from '@/components/Admin/ContentLayout/ContentLayout';
import { Button } from '@/components/ui/button';

const AdminPage = () => {
  return (
    <ContentLayout title="Dashboard">
      <div>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia officiis quo molestias totam
        cum sequi ducimus exercitationem aliquam dolor doloribus eligendi voluptatem iusto, ipsam
        sint! Nam ducimus molestiae mollitia repellat.
      </div>

      <div>
        <Button variant="ghost">Hello world!</Button>
      </div>
    </ContentLayout>
  );
};

export default AdminPage;
