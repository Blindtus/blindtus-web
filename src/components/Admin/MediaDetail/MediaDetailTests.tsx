import { useMemo, useState } from 'react';

import { XIcon } from 'lucide-react';

import AnswerTemperature from '@/components/Answer/AnswerTemperature';
import Clues from '@/components/Clues/Clues';
import InputWithButton from '@/components/ui-custom/InputWithButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LocalMediaType } from '@/types/category.type';
import { Media } from '@/types/media.type';
import { checkSimilarity, evaluateNumber } from '@/utils/similarityUtils';

type Props = {
  media: Media;
};

const MediaDetailTests = ({ media }: Props) => {
  const [titleSimilarity, setTitleSimilarity] = useState<string | null>(null);
  const [hotDateSimilarity, sethotDateSimilarity] = useState<number>(1900);

  const similarityStatusAlertColor = useMemo(() => {
    const similarityStatus = checkSimilarity(titleSimilarity || '', media.title.fr);

    switch (similarityStatus) {
      case 'CORRECT':
        return 'success';
      case 'ALMOST':
        return 'warning';
      case 'WRONG':
        return 'destructive';
      default:
        return 'default';
    }
  }, [media.title.fr, titleSimilarity]);

  return (
    <div className="flex flex-col gap-4">
      <Accordion type="multiple">
        <AccordionItem value="title_similarity">
          <AccordionTrigger>Title similarity</AccordionTrigger>
          <AccordionContent className="p-2">
            <InputWithButton
              onChange={(e) => {
                setTitleSimilarity(e.target.value);
              }}
              value={titleSimilarity ?? ''}
            >
              <Button
                onClick={() => {
                  setTitleSimilarity('');
                }}
                type="button"
                variant="ghost"
                size="sm"
                className="hover:bg-transparent"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </Button>
            </InputWithButton>

            <Alert variant={similarityStatusAlertColor} className="mt-4">
              {checkSimilarity(titleSimilarity || '', media.title.fr)}
            </Alert>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="hotdate_check">
          <AccordionTrigger>Hotdate check</AccordionTrigger>
          <AccordionContent className="p-2">
            <InputWithButton
              onChange={(e) => sethotDateSimilarity(Number(e.target.value))}
              value={hotDateSimilarity ?? ''}
              type="number"
            >
              <Button
                onClick={() => {
                  sethotDateSimilarity(1900);
                }}
                type="button"
                variant="ghost"
                size="sm"
                className="hover:bg-transparent"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </Button>
            </InputWithButton>

            <Alert className="mt-4">
              <AnswerTemperature
                value={media.releaseDate?.toString() ?? '1900'}
                temperature={evaluateNumber(hotDateSimilarity ?? 1900, Number(media.releaseDate))}
              />
            </Alert>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="clues">
          <AccordionTrigger>Clues</AccordionTrigger>
          <AccordionContent className="p-2">
            <Clues
              media={media}
              mediaType={media.category.slug as LocalMediaType}
              currentStep={5}
              expandAll
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default MediaDetailTests;
