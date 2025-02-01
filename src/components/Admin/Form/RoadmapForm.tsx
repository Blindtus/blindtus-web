import { useMemo } from 'react';

import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import InputTag from '@/components/ui-custom/InputTag';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RoadmapValidation } from '@/lib/validations/roadmap';

type RoadmapFormProps = {
  form: ReturnType<typeof useForm<z.infer<typeof RoadmapValidation>>>;
  onSubmit: (data: z.infer<typeof RoadmapValidation>) => void;
  isPending: boolean;
  language: 'en' | 'fr';
};

const RoadmapForm = ({ form, onSubmit, isPending, language }: RoadmapFormProps) => {
  const labelLanguage = useMemo(
    () => language.charAt(0).toUpperCase() + language.slice(1),
    [language],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name={`title${labelLanguage}` as keyof z.infer<typeof RoadmapValidation>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`description${labelLanguage}` as keyof z.infer<typeof RoadmapValidation>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`tags${labelLanguage}` as keyof z.infer<typeof RoadmapValidation>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <InputTag
                  placeholder="Add tags"
                  tags={field.value as string[]}
                  onChange={(tags) =>
                    form.setValue(
                      `tags${labelLanguage}` as keyof z.infer<typeof RoadmapValidation>,
                      tags,
                    )
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!form.getValues('titleEn') || !form.getValues('titleFr') || isPending}
        >
          {isPending ? <Loader size="small" /> : 'Add'}
        </Button>
      </form>
    </Form>
  );
};

export default RoadmapForm;
