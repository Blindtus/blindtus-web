import React, {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

type AudioContextProps = {
  currentlyPlaying: string | null;
  playAudio: (_id: string) => void;
  registerAudio: (_id: string, _audioRef: HTMLAudioElement) => void;
  unregisterAudio: (_id: string, removeCurrentPlaying?: boolean) => void;
};

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const useAudioContext = (): AudioContextProps => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};

type AudioProviderProps = {
  children: ReactNode;
};

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const playAudio = (id: string) => {
    if (currentlyPlaying && currentlyPlaying !== id) {
      audioRefs.current[currentlyPlaying]?.pause();
    }
    setCurrentlyPlaying(id);
  };

  const registerAudio = (id: string, audioRef: HTMLAudioElement) => {
    audioRefs.current[id] = audioRef;
  };

  const unregisterAudio = useCallback((id: string, removeCurrentPlaying = false) => {
    if (removeCurrentPlaying) {
      setCurrentlyPlaying(null);
    }
    delete audioRefs.current[id];
  }, []);

  return (
    <AudioContext.Provider value={{ currentlyPlaying, playAudio, registerAudio, unregisterAudio }}>
      {children}
    </AudioContext.Provider>
  );
};
