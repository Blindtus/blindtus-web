import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import Answer from './Answer';

type ListAnswerProps = {
  className?: string;
  answers: Array<string>;
  isCorrect?: boolean;
  noAnimation?: boolean;
  hideTitle?: boolean;
};

const ListAnswer = ({
  className = '',
  answers = [],
  isCorrect = false,
  noAnimation = false,
  hideTitle = false,
}: ListAnswerProps) => {
  const __ = useTranslations();

  return (
    <div>
      {!hideTitle ? (
        <h2 className="mb-4 text-lg font-semibold leading-4">{__('!noun:your-answers')}</h2>
      ) : null}
      <div className={cn('flex flex-col-reverse gap-2', className)}>
        <AnimatePresence initial>
          {answers.map((answer, index) => (
            <motion.div
              key={index}
              animate={{ transition: { damping: 300 }, x: 0, opacity: 1 }}
              initial={noAnimation ? { x: 0, opacity: 1 } : { x: '-10%', opacity: 0 }}
            >
              <Answer value={answer} isCorrect={isCorrect && index === answers.length - 1} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ListAnswer;
