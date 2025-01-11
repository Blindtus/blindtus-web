import React from 'react';

import { cn } from '@/lib/utils';

type ProgressBarProps = {
  className?: string;
  limit: number;
  value: number | null;
};

const ProgressBar = ({ className = '', limit, value }: ProgressBarProps) => {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="h-3 w-full rounded-lg bg-neutral-800">
        <div
          className={cn(
            'h-3 rounded-lg border-neutral-800 bg-gradient-to-r from-cyan-600 to-primary-special duration-100',
            !!value ? 'transition-all' : null,
          )}
          style={{ width: `${value === null ? 0 : 100 - (value * 100) / limit}%` }}
        />
      </div>
      {!value ? 0 : Math.ceil(limit - value)}
    </div>
  );
};

export default ProgressBar;
