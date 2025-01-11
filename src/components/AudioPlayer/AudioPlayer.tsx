'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { MoreHorizontal, PauseCircle, PlayCircle, RotateCcw } from 'lucide-react';

import Loader from '@/components/Loader/Loader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { useAudioContext } from '@/context/AudioContext';
import { cn } from '@/lib/utils';
import { secondsToMinutes } from '@/utils/audio';

type AudioPlayerProps = {
  className?: string;
  src: string;
  audioId?: string;
  showMoreButton?: boolean;
  isMoreButtonLoading?: boolean;
  defaultStartAt?: number;
  defaultDuration?: number;
  info?: {
    author?: string;
    title?: string;
  };
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  isSmall?: boolean;
};

const AudioPlayer = ({
  className = '',
  src,
  audioId,
  info,
  defaultStartAt = 0,
  defaultDuration = 60,
  showMoreButton = false,
  isMoreButtonLoading = false,
  onEditClick,
  onDeleteClick,
  isSmall = false,
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentlyPlaying, playAudio, registerAudio, unregisterAudio } = useAudioContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(defaultDuration ?? 0);
  const [timecode, setTimecode] = useState(defaultStartAt ?? 0);
  const [audioError, setAudioError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTimecode(defaultStartAt);
  }, [defaultStartAt]);

  useEffect(() => {
    if (defaultDuration) {
      setDuration(defaultDuration);
    }
  }, [defaultDuration]);

  useEffect(() => {
    audioRef.current = new Audio(src);
    const audio = audioRef.current;

    setAudioError(false);

    if (audioId) {
      registerAudio(audioId, audio);
    }

    audioRef.current.addEventListener('loadedmetadata', (event: Event) => {
      const target = event.target as HTMLAudioElement;

      setDuration(target.duration);
      audio.currentTime = defaultStartAt;
      setIsLoading(false);
    });

    audioRef.current.addEventListener('timeupdate', (event: Event) => {
      const target = event.target as HTMLAudioElement;

      if (audio.currentTime >= defaultStartAt + defaultDuration) {
        setIsPlaying(false);
        audio.pause();
      }

      if (audio.currentTime === audio.duration) {
        setIsPlaying(false);
      }

      setTimecode(target.currentTime);
    });

    audioRef.current.addEventListener('error', () => {
      setAudioError(true);
      setIsLoading(false);
    });

    return () => {
      audioRef.current?.pause();

      if (audioId) {
        unregisterAudio(audioId);
      }

      setIsPlaying(false);
    };
  }, [audioId, defaultDuration, defaultStartAt, registerAudio, src, unregisterAudio]);

  const handleTogglePlay = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!audioRef.current) {
        return;
      }

      if (audioId) {
        playAudio(audioId);
      }

      if (audioRef.current.paused) {
        setIsPlaying(true);
        audioRef.current.play();
      } else {
        setIsPlaying(false);
        audioRef.current.pause();
      }
    },
    [audioId, playAudio],
  );

  const handleStartOver = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!audioRef.current) {
        return;
      }

      playAudio(audioRef.current.id);
      audioRef.current.currentTime = defaultStartAt;

      if (isPlaying) {
        audioRef.current.play();
      }
    },
    [defaultStartAt, isPlaying, playAudio],
  );

  useEffect(() => {
    if (currentlyPlaying !== audioId) {
      setIsPlaying(false);
      audioRef.current?.pause();
    } else {
      setIsPlaying(true);
      audioRef.current?.play();
    }
  }, [audioId, currentlyPlaying]);

  const renderMoreButton = useMemo(() => {
    if (!showMoreButton) {
      return null;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="ml-auto size-8 p-0 text-right"
            disabled={isMoreButtonLoading}
          >
            <span className="sr-only">Open menu</span>
            {isMoreButtonLoading ? <Loader /> : <MoreHorizontal className="size-4" />}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {onEditClick ? <DropdownMenuItem onClick={onEditClick}>Edit</DropdownMenuItem> : null}
          {onDeleteClick ? (
            <DropdownMenuItem
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [isMoreButtonLoading, onDeleteClick, onEditClick, showMoreButton]);

  if (audioError || !src) {
    return (
      <div
        className={cn(
          'flex items-center rounded-md border border-slate-700 bg-slate-800',
          isSmall ? 'gap-2 p-2' : 'gap-4 p-4',
          isPlaying ? 'border-emerald-400' : null,
        )}
      >
        <div className="text-red-500">Failed to load audio</div>
        {renderMoreButton}
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-amber-700">Loading...</div>;
  }

  return (
    <>
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure you want to delete this music?</AlertDialogTitle>
          <AlertDialogHeader>
            <AlertDialogDescription asChild>
              <div>
                <p>This action cannot be undone. This will permanently delete the music!</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteClick}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div
        className={cn(
          'flex flex-col rounded-md border border-slate-700 bg-slate-800',
          isSmall ? 'gap-2 p-2' : 'gap-4 p-4',
          isPlaying ? 'border-emerald-400' : null,
        )}
      >
        <div className={cn('flex items-center gap-2', className)}>
          <Button size="icon" variant="ghost" onClick={handleStartOver}>
            <RotateCcw size={isSmall ? 16 : 24} />
          </Button>

          <Button size="icon" variant="ghost" onClick={handleTogglePlay}>
            {isPlaying ? (
              <PauseCircle size={isSmall ? 16 : 24} />
            ) : (
              <PlayCircle size={isSmall ? 16 : 24} />
            )}
          </Button>

          {info && !isSmall ? (
            <div className="ml-2 hidden flex-1 lg:block">
              <div className="font-semibold">{info.title}</div>
              <div className="text-sm">{info.author}</div>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <Slider
            value={[Math.floor(timecode)]}
            max={Math.floor(duration)}
            step={1}
            className={cn(
              isSmall ? 'mx-0 w-full min-w-24 md:mr-2' : 'mx-4 w-full md:mr-8 lg:w-48 lg:max-w-48',
            )}
            onValueChange={(val) => {
              audioRef.current!.currentTime = +val;
            }}
          />

          <div
            className={cn(
              'ml-auto hidden whitespace-nowrap font-mono lg:block',
              isSmall ? 'text-xs' : 'text-sm',
            )}
          >
            {secondsToMinutes(timecode)} <span className="font-sans">/</span>{' '}
            {secondsToMinutes(duration)}
          </div>

          {renderMoreButton}
        </div>

        <div className="flex items-start lg:hidden">
          {info && !isSmall ? (
            <div>
              <div className="font-semibold">{info.title}</div>
              <div className="text-sm">{info.author}</div>
            </div>
          ) : null}

          {!isSmall ? (
            <div className="ml-auto text-sm lg:hidden">
              {secondsToMinutes(timecode)} / {secondsToMinutes(duration)}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
