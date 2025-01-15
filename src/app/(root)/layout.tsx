import React from 'react';

import Background from '@/components/Background';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header';

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Background />
      <Header />
      <main className="flex-grow pb-12">{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
