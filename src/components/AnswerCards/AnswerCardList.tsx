import React, { useMemo, useState } from 'react';

import type { Media } from '@/types/media.type';
import { type SimilarityStatusType } from '@/utils/similarityUtils';

import AnswerCard from './AnswerCard';

const NUMBER_CARDS = 7;

type AnswerCardListProps = {
  media: Media;
  onClick?: (_answer: string) => SimilarityStatusType | undefined;
};

const AnswerCardList = ({ media, onClick }: AnswerCardListProps) => {
  const [cardHover, setCardHover] = useState<null | number>(null);

  const mediaList = useMemo(() => {
    const mediaList = media.similar?.slice(0, NUMBER_CARDS) || [];
    mediaList.push(media);
    // rendomize the list
    return mediaList.sort(() => Math.random() - 0.5);
  }, [media]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {mediaList.map((media, index) => (
        <AnswerCard
          key={index}
          media={media}
          onHover={() => setCardHover(index)}
          onLeave={() => setCardHover(null)}
          onClick={onClick!}
          isGrayscale={cardHover !== null && cardHover !== index}
        />
      ))}
    </div>
  );
};

export default AnswerCardList;
