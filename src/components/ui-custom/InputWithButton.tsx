import React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  children?: React.ReactNode;
};

const InputWithButton = ({ className = '', children, ...rest }: Props) => {
  return (
    <div className={cn('relative w-full', className)}>
      <Input className="w-full pr-9" {...rest} />

      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ className?: string }>(child)) {
          return React.cloneElement(child, {
            ...child.props,
            className: cn('absolute right-0 top-0 h-full px-3 py-2', child.props.className),
          });
        }
        return child;
      })}
    </div>
  );
};

export default InputWithButton;
