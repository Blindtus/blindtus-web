import { useGenericQuery } from '@/hooks/use-generic-query';

import { askGetAllTimeTodayAnalytic, askGetTodayAnalytic } from '../api/analytic';
import { QUERY_KEYS } from './queryKeys';

export const useGetTodayAnalytic = () => {
  return useGenericQuery([QUERY_KEYS.ANALYTIC_TODAY], askGetTodayAnalytic);
};

export const useGetAllTimeTodayAnalytic = () => {
  return useGenericQuery([QUERY_KEYS.ANALYTIC_ALL_TIME], askGetAllTimeTodayAnalytic);
};
