import React from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { cn } from '@/lib/utils';

type SortableItemProps = {
  className?: string;
  children?: React.ReactNode;
  id: string | number;
};

const SortableItem = ({ className = '', children, id }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn('touch-none', className)}
    >
      {children}
    </div>
  );
};

export default SortableItem;
