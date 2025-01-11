'use client';

import { useStore } from 'zustand';

import Footer from '@/components/Admin/Footer/Footer';
import { Sidebar } from '@/components/Admin/Sidebar/Sidebar';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';
import { cn } from '@/lib/utils';

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          'min-h-[calc(100vh_-_56px)] bg-gray-900 transition-[margin-left] duration-300 ease-in-out',
          sidebar?.isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72',
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          'transition-[margin-left] duration-300 ease-in-out',
          sidebar?.isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72',
        )}
      >
        <Footer />
      </footer>
    </>
  );
}
