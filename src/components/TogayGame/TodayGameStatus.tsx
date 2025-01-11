import React from 'react';

import { Alert } from '@/components/ui/alert';
import { SimilarityStatusType, similarityStatus } from '@/utils/similarityUtils';

type TodayGameStatusProps = {
  status: SimilarityStatusType;
};

const TodayGameStatus = ({ status }: TodayGameStatusProps) => {
  if (status !== similarityStatus.ALMOST) {
    return null;
  }

  return <Alert variant="warning">Presque !</Alert>;
};

export default TodayGameStatus;
