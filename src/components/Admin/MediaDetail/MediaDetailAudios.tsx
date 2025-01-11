import React, { useCallback, useEffect, useState } from 'react';

import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import Loader from '@/components/Loader/Loader';
import { AddAudioModal, EditAudioModal } from '@/components/Modal';
import { useAudioContext } from '@/context/AudioContext';
import { useGetMediaMusics } from '@/lib/react-query/MediaQueries';
import { useDeleteMusic } from '@/lib/react-query/MusicQueries';
import type { Music } from '@/types/audio.type';
import type { Media } from '@/types/media.type';

type MediaDetailAudiosProps = {
  media: Media;
};

const MediaDetailAudios = ({ media }: MediaDetailAudiosProps) => {
  const [selectedAudio, setSelectedAudio] = useState<Music | null>(null);
  const { unregisterAudio } = useAudioContext();
  const { data: audios, isFetching: isAudiosFetching } = useGetMediaMusics(media._id);
  const { mutateAsync: deleteMusic } = useDeleteMusic();

  useEffect(() => {
    return () => {
      unregisterAudio(selectedAudio?._id || '', true);
    };
  }, [audios, selectedAudio?._id, unregisterAudio]);

  const handleEditClick = useCallback((audio: Music) => {
    setSelectedAudio(audio);
  }, []);

  const handleOnUpdateAudioModalClose = useCallback(() => {
    setSelectedAudio(null);
  }, []);

  const handleOnDeleteAudio = useCallback(
    (audioId: string) => {
      deleteMusic(audioId);
    },
    [deleteMusic],
  );

  if (isAudiosFetching) {
    return <Loader />;
  }

  if (!audios) {
    return <div>No audios found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <AddAudioModal media={media} className="w-auto self-start">
        Add audio file
      </AddAudioModal>

      {audios.map((audio) => (
        <AudioPlayer
          key={audio._id}
          audioId={audio._id}
          src={audio.audioPath || ''}
          info={audio}
          showMoreButton
          onEditClick={() => handleEditClick(audio)}
          onDeleteClick={() => handleOnDeleteAudio(audio._id)}
        />
      ))}
      {selectedAudio ? (
        <EditAudioModal audio={selectedAudio} isOpen onClose={handleOnUpdateAudioModalClose} />
      ) : null}
    </div>
  );
};

export default MediaDetailAudios;
