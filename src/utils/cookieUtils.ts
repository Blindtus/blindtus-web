export const setCookie = (name: string, val: string) => {
  const date = new Date();
  const value = val;

  date.setTime(date.getTime() + 355 * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};

export const getCookie = (name: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length == 2) {
    const lastPart = parts.pop();
    if (lastPart) {
      return lastPart.split(';').shift();
    }
  }
};

export const deleteCookie = (name: string) => {
  const date = new Date();

  // Set it expire in -1 days
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);

  // Set it
  document.cookie = `${name}=; expires=${date.toUTCString()}; path=/`;
};
