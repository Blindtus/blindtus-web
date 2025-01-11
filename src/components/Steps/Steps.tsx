import React from 'react';

import { cn } from '@/lib/utils';

type StepsProps = {
  className?: string;
  steps: Array<number>;
  active?: number;
  isCorrect?: boolean;
};

const Steps = ({ className = '', steps, active = 0, isCorrect = false }: StepsProps) => {
  return (
    <div className={cn('flex gap-4', className)}>
      {steps.map((step) => {
        const isActive = step === active;
        const isCompleted = step < active;

        let bgColor = 'bg-neutral-300';
        if (isCompleted) bgColor = 'bg-pink-500';
        if (isActive) bgColor = 'bg-primary-special';
        if (isActive && isCorrect) bgColor = 'bg-emerald-400';
        return <div key={step} className={cn('h-1.5 flex-1 rounded', bgColor)} />;
      })}
    </div>
  );
};

export default Steps;
