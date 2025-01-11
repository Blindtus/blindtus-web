import type { HistoryTodayDatas } from '@/types/today.type';

const SESSION_NAME = 'todayHistory';

type HistoryToday = Record<string, Record<string, HistoryTodayDatas>>;

export const saveTodayHistory = (todayId: string, history: HistoryTodayDatas) => {
  const allTodayHistory = getAllHistory();

  const todayHistory: Record<string, HistoryTodayDatas> = allTodayHistory[todayId] || [];

  const updateTodayHistory = {
    ...todayHistory,
    [history.type]: history,
  };

  const updatedHistory = {
    ...allTodayHistory,
    [todayId]: updateTodayHistory,
  };

  saveTodayHistoryToLocalStorage(updatedHistory);
};

const saveTodayHistoryToLocalStorage = (history: HistoryToday) => {
  localStorage.setItem(SESSION_NAME, JSON.stringify(history));
};

export const getAllHistory = (): HistoryToday => {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return JSON.parse(localStorage.getItem(SESSION_NAME) || '{}');
  }
  return {};
};

export const getTodayHistoryByTodayId = (todayId: string) => {
  const allTodayHistory = getAllHistory();
  return allTodayHistory[todayId];
};
