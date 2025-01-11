import React from 'react';

import { CircleCheck, CircleX } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

type AnswerProps = {
  className?: string;
  value: string;
  isCorrect?: boolean;
};

const Answer = ({ className = '', value, isCorrect = false }: AnswerProps) => {
  const __ = useTranslations();
  return (
    <div
      className={cn('flex items-center gap-2 rounded border-slate-800 bg-slate-900 p-3', className)}
    >
      <div className="flex size-8 flex-col items-center justify-center rounded-full bg-slate-800 p-1">
        {isCorrect ? (
          <CircleCheck size={20} className="text-emerald-400" />
        ) : (
          <CircleX size={20} className="text-pink-400" />
        )}
      </div>
      <span className={cn('flex-1 truncate', value === '' ? 'text-muted-foreground' : null)}>
        {value || __('!noun:empty')}
      </span>
    </div>
  );
};

export default Answer;
