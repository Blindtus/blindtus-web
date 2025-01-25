import clipboard from 'clipboardy';
import { format } from 'date-fns';

import { HistoryTodayDatas } from '@/types/today.type';

import { getTodayHistoryByTodayId } from './historyUtils';

const EMOJIS = {
  success: '✅',
  error: '❌',
  default: '⚠️',
};

const CATEGORIES: { [key: string]: string } = {
  blindtus: '🎵',
  pixelus: '🏙️',
  castus: '😶',
  hotDate: '🔥',
  titleTwist: '🌪️',
};

const createHeader = () => {
  const date = new Date();

  const currentDate = format(date, 'MM/dd/yyyy');

  return `🍿 BlindTus 📺 - ${currentDate}`;
};

const createCategory = (history: HistoryTodayDatas, type: string, max?: number) => {
  const content = `${CATEGORIES[type]}`;
  const score = createScore(history, max);

  if (!history || !history.isCompleted) {
    return `${content} ${EMOJIS.default} ${score}`;
  }

  if (!history.isCorrect) {
    return `${content} ${EMOJIS.error} ${score}`;
  }

  return `${content} ${EMOJIS.success} ${score}`;
};

const createScore = (history: HistoryTodayDatas, max?: number) => {
  if (!history) {
    return `(0${max ? `/${max}` : ''})`;
  }

  return `(${history.attempts.length}${max ? `/${max}` : ''})`;
};

export const copyToClipboardTodayHistoryGamnes = (todayId: string) => {
  const history = getTodayHistoryByTodayId(todayId);

  const header = createHeader();

  const blindtus = createCategory(history.blindtus, 'blindtus', 5);
  const pixelus = createCategory(history.pixelus, 'pixelus', 5);
  const castus = createCategory(history.castus, 'castus', 5);
  const hotDate = createCategory(history.hotDate, 'hotDate');
  const titleTwist = createCategory(history.titleTwist, 'titleTwist', 5);

  let content = `${header}\n\n${blindtus}\n${pixelus}\n${castus}\n${hotDate}\n${titleTwist}`;

  const hostname = window.location.href;

  content = `${content}\n${hostname}`;

  try {
    clipboard.write(content);

    return {
      message: 'Résumé copié dans le presse-papier.',
      isError: false,
    };
  } catch {
    return {
      message: "Votre navigateur n'est pas compatible.",
      isError: true,
    };
  }
};
