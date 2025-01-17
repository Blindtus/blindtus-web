import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import { evaluateNumber } from '@/utils/similarityUtils';

import AnswerTemperature from './AnswerTemperature';

type ListAnswerTemperatureProps = {
  className?: string;
  answers: Array<string>;
  refAnswer?: number;
  noAnimation?: boolean;
  hideTitle?: boolean;
};

const ListAnswerTemperature = ({
  className = '',
  answers = [],
  refAnswer = 0,
  noAnimation = false,
  hideTitle = false,
}: ListAnswerTemperatureProps) => {
  const __ = useTranslations();

  return (
    <div>
      {!hideTitle ? (
        <h2 className="mb-4 text-lg font-semibold leading-4">{__('!noun:your-answers')}</h2>
      ) : null}
      <div className={cn('flex flex-col-reverse gap-2', className)}>
        <AnimatePresence initial>
          {answers.map((answer, index) => {
            const temperature = refAnswer ? evaluateNumber(refAnswer, Number(answer)) : 'cold';
            return (
              <motion.div
                key={index}
                animate={{ transition: { damping: 300 }, x: 0, opacity: 1 }}
                initial={noAnimation ? { x: 0, opacity: 1 } : { x: '-10%', opacity: 0 }}
              >
                <AnswerTemperature value={answer} temperature={temperature} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ListAnswerTemperature;
