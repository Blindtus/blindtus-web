export const isMobileDevice = () => {
  // test if navigator exist
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
