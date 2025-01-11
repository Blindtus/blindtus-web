import React from 'react';

import Background from '@/components/Background';
import Header from '@/components/Header';

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <div>
      <Background />
      <Header />
      <div className="pb-12">{children}</div>
    </div>
  );
};

export default RootLayout;
