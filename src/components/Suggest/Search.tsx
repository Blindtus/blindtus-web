'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { parseAsString, useQueryStates } from 'nuqs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useGetSearchedMediasSuggest } from '@/lib/react-query/TmdbQueries';
import { cn } from '@/lib/utils';
import { SuggestSearchValidation } from '@/lib/validations/suggest';

import MediaCardSuggest from '../MediaCard/MediaCardSuggest';
import { Button } from '../ui/button';

type Props = {
  className?: string;
};

const SuggestSearch = ({ className = '' }: Props) => {
  const __ = useTranslations('');
  const [filter, setFilter] = useQueryStates({
    query: parseAsString.withDefault(''),
    type: parseAsString.withDefault(''),
  });

  const form = useForm<z.infer<typeof SuggestSearchValidation>>({
    resolver: zodResolver(SuggestSearchValidation),
    defaultValues: {
      title: filter.query,
    },
  });

  const { data: searchedMedias, refetch: refetchSearch } = useGetSearchedMediasSuggest({
    query: filter.query,
  });

  useEffect(() => {
    if (filter.query) {
      refetchSearch();
    }
  }, [filter.query, refetchSearch]);

  const onSubmit = async (data: z.infer<typeof SuggestSearchValidation>) => {
    try {
      setFilter({
        query: data.title,
      });

      refetchSearch();
    } catch (error) {
      toast({
        title: (error as Error).message as string,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={cn(className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    className="input--lg"
                    {...field}
                    placeholder="Mad max, Breaking bad, ..."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" size="xl" variant="primary" className="mb-[0.1rem]">
            <SearchIcon size={18} />
            <span className="hidden md:block">{__('!text:search')}</span>
          </Button>
        </form>
      </Form>

      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {searchedMedias?.data?.map((media) => <MediaCardSuggest key={media.id} media={media} />)}
      </div>
    </div>
  );
};

export default SuggestSearch;
