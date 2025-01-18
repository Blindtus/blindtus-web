import React, { useCallback, useMemo, useState } from 'react';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
  closestCenter,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

import { cn } from '@/lib/utils';

import SortableItem from './SortableItem';

type SortableWrapperProps<T> = {
  items: Array<T>;
  keyId: keyof T;
  children: React.ReactNode;
  onChange?: (_items: Array<T>) => void;
};

const SortableWrapper = <T,>({ items, keyId, children, onChange }: SortableWrapperProps<T>) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = items.findIndex((item) => item[keyId] === active.id) ?? -1;
      const newIndex = items.findIndex((item) => item[keyId] === over.id) ?? -1;

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      onChange?.(arrayMove(items, oldIndex, newIndex));
    },
    [items, keyId, onChange],
  );

  const activeChild = useMemo(
    () =>
      React.Children.toArray(children).find((child) => {
        const childKey = (child as React.ReactElement).key?.replace('.$', '');
        return childKey === activeId?.toString();
      }),
    [activeId, children],
  );

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext items={items.map((item) => item[keyId] as UniqueIdentifier)}>
          {React.Children.map(children, (child) => {
            const childElement = child as React.ReactElement;
            if (!child || !childElement.key) {
              return null;
            }

            const isChildActive = childElement.key.replace('.$', '') === activeId?.toString();

            return (
              <SortableItem
                key={childElement.key}
                id={childElement.key}
                className={cn(isChildActive ? 'opacity-25' : null)}
              >
                {child}
              </SortableItem>
            );
          })}
        </SortableContext>
        <DragOverlay>{activeId ? activeChild : null}</DragOverlay>
      </DndContext>
    </>
  );
};

export default SortableWrapper;
