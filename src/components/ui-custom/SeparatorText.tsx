import React, { type ReactNode } from 'react';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type SeparatorTextProps = {
  className?: string;
  children: ReactNode;
};

const SeparatorText = ({ className = '', children }: SeparatorTextProps) => {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Separator className="flex-1 bg-neutral-200" />
      <span className="text-sm font-medium text-foreground">{children}</span>
      <Separator className="flex-1 bg-neutral-200" />
    </div>
  );
};

export default SeparatorText;
