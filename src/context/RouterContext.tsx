'use client';

import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

type HistoryContextType = {
  history: string[];
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setHistory((prevHistory) => {
      if (prevHistory[prevHistory.length - 1] !== `${pathname}?${query.toString()}`) {
        return [...prevHistory, `${pathname}?${query.toString()}`];
      }
      return prevHistory;
    });
  }, [pathname]);

  return <HistoryContext.Provider value={{ history }}>{children}</HistoryContext.Provider>;
};

// Custom hook to use the history context
export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
