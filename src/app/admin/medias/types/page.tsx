'use client';

import React, { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ContentLayout } from '@/components/Admin/ContentLayout/ContentLayout';
import DataTable from '@/components/DataTable';
import Loader from '@/components/Loader/Loader';
import MediaTypeSelector from '@/components/Selector/MediaTypeSelector';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { useCreateCategory, useGetAllCategories } from '@/lib/react-query/CategoryQueries';
import { CategoryValidation } from '@/lib/validations/category';
import type { Category } from '@/types/category.type';

import { columns } from './columns';

const MediaTypesPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { mutateAsync: createCategory } = useCreateCategory();

  const { data: categories, isFetching: isFetchingCategories } = useGetAllCategories();

  const form = useForm<z.infer<typeof CategoryValidation>>({
    resolver: zodResolver(CategoryValidation),
    defaultValues: {
      label: '',
      labelFr: '',
      type: '',
      isDisplayInGame: false,
      isDisplayInToday: false,
      isDisplayInTodayPixelux: false,
      isDisplayInTodayHotDate: false,
    },
  });

  const handleCloseSheet = useCallback(() => {
    form.reset();
    setIsSheetOpen(false);
  }, [form]);

  const onSubmit = async (category: z.infer<typeof CategoryValidation>) => {
    try {
      const newCategory = await createCategory(category);

      if (!newCategory) {
        toast({
          title: 'Failed to save category',
          variant: 'destructive',
        });

        return;
      }

      handleCloseSheet();
    } catch (error) {
      console.error('Failed to save category', error);
    }
  };

  return (
    <ContentLayout title="Media types">
      <div className="flex justify-end">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="size-4" /> new category
            </Button>
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>New category</SheetTitle>
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
                      <FormLabel>Type</FormLabel>
                      <MediaTypeSelector value={field.value} onChange={field.onChange} />
                    </FormItem>
                  )}
                />

                <SheetFooter>
                  <Button variant="ghost" onClick={() => form.reset()}>
                    Reset
                  </Button>
                  <Button type="submit">Save</Button>
                </SheetFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="py-10">
        {isFetchingCategories ? (
          <Loader />
        ) : (
          <DataTable columns={columns} data={categories?.data as unknown as Array<Category>} />
        )}
      </div>
    </ContentLayout>
  );
};

export default MediaTypesPage;
