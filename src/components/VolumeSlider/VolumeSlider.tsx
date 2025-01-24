'use client';

import { Volume2Icon, VolumeIcon } from 'lucide-react';

import { Slider } from '@/components/ui/slider';
import { useAudioContext } from '@/context/AudioContext';
import { cn } from '@/lib/utils';
import { isMobileDevice } from '@/utils/deviceUtils';

type Props = {
  className?: string;
};

const VolumeSlider = ({ className = '' }: Props) => {
  const { volume, setVolume } = useAudioContext();

  if (isMobileDevice() || !volume) {
    return null;
  }

  return (
    <div className={cn(className)}>
      <label className="mb-2 flex items-center justify-between">
        Volume <span className="font-semibold">{volume}%</span>
      </label>
      <div className="flex items-center gap-2">
        <div className="w-4">
          <VolumeIcon />
        </div>
        <Slider value={[volume]} max={100} step={1} onValueChange={(v) => setVolume(Number(v))} />
        <div>
          <Volume2Icon />
        </div>
      </div>
    </div>
  );
};

export default VolumeSlider;
