import React, { useCallback, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useAddMusic } from '@/lib/react-query/MusicQueries';
import { AddMusicValidation } from '@/lib/validations/music';
import type { Media } from '@/types/media.type';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

type AudioModalProps = {
  className?: string;
  children?: React.ReactNode;
  media: Media;
};

const AudioModal = ({ className = '', children, media }: AudioModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { mutateAsync: addAudio, isPending } = useAddMusic();

  const form = useForm<z.infer<typeof AddMusicValidation>>({
    resolver: zodResolver(AddMusicValidation),
    defaultValues: {
      startAt: 0,
      duration: 60,
      title: '',
      author: '',
    },
  });

  const watchStartAt = form.watch('startAt');
  const watchDuration = form.watch('duration');

  const reset = useCallback(() => {
    setPreview(null);
  }, []);

  useEffect(() => {
    if (!showModal) {
      reset();
    }
  }, [showModal, reset]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const selectedFile = event.target.files[0];
        form.setValue('file', selectedFile);

        const audioFile = URL.createObjectURL(selectedFile);
        setPreview(audioFile);
      } else {
        reset();
      }
    },
    [form, reset],
  );

  const onSubmit = async (audio: z.infer<typeof AddMusicValidation>) => {
    try {
      const newAudio = await addAudio({
        title: audio.title,
        author: audio.author,
        duration: audio.duration,
        startAt: audio.startAt,
        media: media._id,
        audio: audio.file,
      });

      if (newAudio) {
        reset();
        setShowModal(false);
      }
    } catch (error) {
      toast({
        title: (error as Error).message as string,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog onOpenChange={setShowModal} open={showModal}>
      <DialogTrigger asChild>
        <Button className={className}>{children ?? 'Open'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new audio file</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>MP3 file</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="audio/mp3"
                      onChange={handleFileChange}
                      className="pt-3 file:rounded-sm file:bg-neutral-800 file:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {preview ? (
              <>
                <AudioPlayer
                  src={preview}
                  defaultStartAt={watchStartAt}
                  defaultDuration={watchDuration}
                  isSmall
                />
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="startAt"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Start at</FormLabel>
                        <FormControl>
                          <Input type="number" step={1} min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input type="number" step={1} min={0} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
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

                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Uploading...' : 'Upload'}
                </Button>
              </>
            ) : (
              <DialogDescription>No file selected</DialogDescription>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AudioModal;
