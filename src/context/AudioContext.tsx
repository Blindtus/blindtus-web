'use client';

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

type Props = {
  volume?: number;
  setVolume: (volume: number) => void;
};

const AudioContext = createContext<Props | undefined>({
  volume: 80,
  setVolume: () => {},
});

export const useAudioContext = (): Props => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within a AudioContextProvider');
  }
  return context;
};

type ProviderProps = {
  children: ReactNode;
};

export const AudioContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [volume, setVolume] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Access `localStorage` only after the component has mounted
    const savedVolume = localStorage.getItem('volume') || 80;

    if (savedVolume) {
      setVolume(Number(savedVolume));
    }
  }, []);

  useEffect(() => {
    // save volume value in local storage
    localStorage.setItem('volume', (volume ?? 80).toString());
  }, [volume]);

  const value = useMemo(
    () => ({
      volume,
      setVolume,
    }),
    [volume],
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
