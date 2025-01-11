import stringComparison from 'string-comparison';

import { normalize } from './stringUtils';

export const similarityStatus = Object.freeze({
  CORRECT: 'CORRECT',
  ALMOST: 'ALMOST',
  WRONG: 'WRONG',
});

export type SimilarityStatusKeysType = keyof typeof similarityStatus;

export type SimilarityStatusType = (typeof similarityStatus)[keyof typeof similarityStatus];

const SCORE_CORRECT = 0.85;
const SCORE_ALMOST = 0.75;

const lcs = stringComparison.lcs;

const checkSimilarityBetweenTwoStrings = (
  stringToCheck: string,
  sample: string,
): SimilarityStatusType => {
  const formatedStringToCheck = normalize(stringToCheck);
  const formatedSample = normalize(sample);
  const similarityScore = lcs.similarity(formatedStringToCheck, formatedSample);

  let status: SimilarityStatusType = similarityStatus.WRONG;

  if (similarityScore >= SCORE_ALMOST) {
    status = similarityStatus.ALMOST;
  }

  if (similarityScore >= SCORE_CORRECT) {
    status = similarityStatus.CORRECT;
  }

  return status;
};

export const checkSimilarity = (
  stringToCheck: string,
  samples: Array<string> | string,
): SimilarityStatusType => {
  if (typeof samples === 'string') {
    return checkSimilarityBetweenTwoStrings(stringToCheck, samples);
  }

  const results = samples.map((sample) => checkSimilarityBetweenTwoStrings(stringToCheck, sample));

  if (results.includes(similarityStatus.CORRECT)) {
    return similarityStatus.CORRECT;
  }

  if (results.includes(similarityStatus.ALMOST)) {
    return similarityStatus.ALMOST;
  }

  return similarityStatus.WRONG;
};
