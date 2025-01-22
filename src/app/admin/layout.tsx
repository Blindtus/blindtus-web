'use client';

import React from 'react';

import { ThemeProvider } from 'next-themes';

import AdminPanelLayout from '@/components/Admin/Panel/Panel';
import { AudioProvider } from '@/context/AdminAudioContext';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AdminPanelLayout>
        <AudioProvider>{children}</AudioProvider>
      </AdminPanelLayout>
    </ThemeProvider>
  );
};

export default AdminLayout;
