import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

type Props = {
  volume: number;
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
  const [volume, setVolume] = useState(
    localStorage.getItem('volume') ? Number(localStorage.getItem('volume')) : 80,
  );

  useEffect(() => {
    // save volume value in local storage
    localStorage.setItem('volume', volume.toString());
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
