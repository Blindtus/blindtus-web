import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const loaderVariants = cva('animate-spin rounded-full border-2 border-solid', {
  variants: {
    color: {
      default: 'border-neutral-200 border-t-transparent',
      primary: 'border-customAccent border-t-transparent',
    },
    size: {
      small: 'size-4',
      medium: 'size-6',
      large: 'size-8',
    },
  },
  defaultVariants: {
    color: 'default',
    size: 'medium',
  },
});

type LoaderVariants = VariantProps<typeof loaderVariants>;

type LoaderProps = LoaderVariants & {
  className?: string;
};

const Loader = ({ className, size, color }: LoaderProps) => (
  <div className={cn(className)}>
    <div className={cn(loaderVariants({ color, size }))}></div>
  </div>
);

export default Loader;
