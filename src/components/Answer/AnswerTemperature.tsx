import React from 'react';

import { ThermometerIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { TemperatureType } from '@/utils/similarityUtils';

type AnswerTemperatureProps = {
  className?: string;
  value: string;
  temperature?: TemperatureType;
};

const AnswerTemperature = ({
  className = '',
  value,
  temperature = 'cold',
}: AnswerTemperatureProps) => {
  const __ = useTranslations();
  return (
    <div
      className={cn('flex items-center gap-2 rounded border-slate-800 bg-slate-900 p-3', className)}
    >
      <div className="flex size-8 flex-col items-center justify-center rounded-full bg-slate-800 p-1">
        <ThermometerIcon
          className={cn('h-10 w-6', {
            'text-blue-500': temperature === 'cold',
            'text-yellow-500': temperature === 'warm',
            'text-red-500': temperature === 'hot',
            'text-green-500': temperature === 'correct',
          })}
        />
      </div>
      <span className={cn('flex-1 truncate', value === '' ? 'text-muted-foreground' : null)}>
        {value || __('!noun:empty')}
      </span>
    </div>
  );
};

export default AnswerTemperature;
