'use client';

import React, { type ReactNode } from 'react';

type ClientContextProps = {
  children: ReactNode;
};

const ClientContext = ({ children }: ClientContextProps) => {
  return <>{children}</>;
};

export default ClientContext;
