import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDateFr = (date: Date | string, dateFormat: string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, dateFormat, { locale: fr });
};
