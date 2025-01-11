import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useUpdateMusic } from '@/lib/react-query/MusicQueries';
import { UpdateAudioValidation } from '@/lib/validations/music';
import type { Music } from '@/types/audio.type';

type AudioModalProps = {
  audio: Music;
  isOpen?: boolean;
  onClose?: () => void;
};

const EditAudioModal = ({ audio, isOpen = false, onClose }: AudioModalProps) => {
  const [showModal, setShowModal] = useState(isOpen);

  const { mutateAsync: onUpdateMusic, isPending } = useUpdateMusic();

  const form = useForm<z.infer<typeof UpdateAudioValidation>>({
    resolver: zodResolver(UpdateAudioValidation),
    defaultValues: {
      title: audio.title,
      author: audio.author,
    },
  });

  useEffect(() => {
    if (!showModal) {
      onClose?.();
    }
  }, [onClose, showModal]);

  const onSubmit = async (updateAudio: z.infer<typeof UpdateAudioValidation>) => {
    try {
      const updatedAudio = await onUpdateMusic({
        musicId: audio._id,
        music: updateAudio,
        mediaId: audio.media as unknown as string,
      });

      if (updatedAudio) {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {audio.title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              {isPending ? 'Updating...' : 'Update'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAudioModal;
