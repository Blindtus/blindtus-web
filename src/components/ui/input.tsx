import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isWiggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isWiggle = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn('input', isWiggle ? 'animate-wiggle' : null, className)}
        style={{
          animationIterationCount: isWiggle ? 4 : undefined,
          animationDirection: isWiggle ? 'alternate' : undefined,
        }}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
