'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ContentLayout } from '@/components/Admin/ContentLayout/ContentLayout';
import RoadmapForm from '@/components/Admin/Form/RoadmapForm';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useCreateRoadmap } from '@/lib/react-query/RoadmapQueries';
import { RoadmapValidation } from '@/lib/validations/roadmap';

const AddRoadmapPage = () => {
  const router = useRouter();
  const { mutateAsync: createRoadmap, isPending } = useCreateRoadmap();

  const form = useForm<z.infer<typeof RoadmapValidation>>({
    resolver: zodResolver(RoadmapValidation),
    defaultValues: {
      titleEn: '',
      titleFr: '',
      descriptionEn: '',
      descriptionFr: '',
      tagsEn: [],
      tagsFr: [],
    },
  });

  const onSubmit = async (data: z.infer<typeof RoadmapValidation>) => {
    try {
      const formatedData = {
        title: {
          en: data.titleEn,
          fr: data.titleFr,
        },
        description: {
          en: data.descriptionEn,
          fr: data.descriptionFr,
        },
        tags: {
          en: data.tagsEn,
          fr: data.tagsFr,
        },
      };

      const response = await createRoadmap(formatedData);

      if (response.data) {
        toast({
          title: 'Roadmap item created',
        });

        router.push('/admin/roadmap');
      } else {
        toast({
          title: response.error?.message || 'An error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: (error as Error).message as string,
        variant: 'destructive',
      });
    }
  };

  return (
    <ContentLayout title="Add roadmap Item">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/roadmap">Roadmap</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add roadmap</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-16">
        <Tabs defaultValue="en">
          <TabsList>
            <TabsTrigger value="en">En</TabsTrigger>
            <TabsTrigger value="fr">fr</TabsTrigger>
          </TabsList>

          <TabsContent value="en">
            <RoadmapForm form={form} onSubmit={onSubmit} isPending={isPending} language="en" />
          </TabsContent>
          <TabsContent value="fr">
            <RoadmapForm form={form} onSubmit={onSubmit} isPending={isPending} language="fr" />
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  );
};

export default AddRoadmapPage;
