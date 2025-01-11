'use client';

import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { MediaTypeSelector } from '@/components/Selector';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { useDeleteCategory, useUpdateCategory } from '@/lib/react-query/CategoryQueries';
import { CategoryValidation } from '@/lib/validations/category';
import { Category } from '@/types/category.type';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'label',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Label
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'labelFr',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Label FR
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <ActionCell row={row} />;
    },
  },
];

const ActionCell = ({ row }: { row: Row<Category> }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const mediaType = row.original;
  const { mutateAsync: updateCategory } = useUpdateCategory();

  const form = useForm<z.infer<typeof CategoryValidation>>({
    resolver: zodResolver(CategoryValidation),
    defaultValues: {
      label: mediaType.label,
      labelFr: mediaType.labelFr,
      type: mediaType.type,
      isDisplayInGame: mediaType.isDisplayInGame,
      isDisplayInToday: mediaType.isDisplayInToday,
      isDisplayInTodayPixelux: mediaType.isDisplayInTodayPixelux,
    },
  });

  const handleCloseSheet = useCallback(() => {
    form.reset();
    setIsSheetOpen(false);
  }, [form]);

  const onSubmit = async (newCategory: z.infer<typeof CategoryValidation>) => {
    try {
      const updatedMediaType = await updateCategory({ id: mediaType._id, category: newCategory });

      if (!updatedMediaType) {
        toast({
          title: 'Failed to update media type',
          variant: 'destructive',
        });

        return;
      }

      handleCloseSheet();
    } catch (error) {
      console.error('Failed to save media type', error);
    }
  };

  const { mutateAsync: deleteMediaType } = useDeleteCategory();

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0 text-right">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsSheetOpen(true)} className="cursor-pointer">
            Update
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              deleteMediaType(mediaType._id);
            }}
            className="cursor-pointer"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Update {mediaType.label} type</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="labelFr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label FR</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media type</FormLabel>
                    <MediaTypeSelector value={field.value} onChange={field.onChange} />
                  </FormItem>
                )}
              />

              <SheetFooter>
                <Button variant="ghost" onClick={() => setIsSheetOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
};
