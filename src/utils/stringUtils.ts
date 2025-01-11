export const removeAccents = (str: string): string => {
  if (!str) return str;
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const normalize = (str: string): string => {
  return removeAccents(str).toLowerCase();
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
